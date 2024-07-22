import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextError, setSendTextError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  //initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add online users
  useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", user?._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (!socket) return;

    const recipientId = currentChat?.members.find((id) => id != user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // get Message & notification
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id != res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id == res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
      // console.log(notifications);
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getOtherUsers = async () => {
      //array of all users from the database
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error)
        return console.log(`Error fetching users ! ${response}`);
      // filters out the logged in user itself and the users those who already have a chat with the user
      const othrUsers = response.filter((u) => {
        let isChatCreated = false;
        if (u._id == user?._id) return false; // excluding the user
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] == u._id || chat.members[1] == u._id;
          });
        } // excluding the users that already have a chat with current user
        return !isChatCreated;
      });
      setOtherUsers(othrUsers);
      setAllUsers(response);
    };
    getOtherUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setUserChatsError(null);
        setIsUserChatsLoading(true);
        // array of all the users that the current signed in user has a chat with
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);
        if (response.error) return setUserChatsError(response);
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setMessagesError(null);
      setIsMessagesLoading(true);
      // getMessages for the current selected chat
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) return setMessagesError(response);
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    // creates a new chat between two users and returns the chat object
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) return console.log("Error creating chat !", response);

    setUserChats((prev) => [...prev, response]);
  }, []);

  const sendMessage = useCallback(
    async (textMsg, sender, currentChatId, setTextMsg) => {
      if (!textMsg) return;

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMsg,
        })
      );

      if (response.error) return setSendTextError(response);

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMsg("");
    },
    []
  );

  const closeNotifications = useCallback(() => {
    setIsNotificationOpen(false);
  });
  // clear notifications for a particular chat
  const clearChatNotifications = useCallback((thisUserNotifications, notifications) => {
    const updatedNotifications = notifications.map(notification => {
      let n;
      thisUserNotifications.forEach((e) => {
            n = e.senderId == notification.senderId ? {...e, isRead: true} : notification;
      });
      return n;
    });
    setNotifications(updatedNotifications);
  }, []);

  const markAllAsRead = useCallback((notifications) => {
    const updatedNotifications = notifications.map((notification) => {
      return { ...notification, isRead: true };
    });
    setNotifications(updatedNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (notification, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        // finds the chat to be opened from ther sender in the notification
        const chatMembers = [user._id, notification.senderId];
        return chat?.members.every((member) => chatMembers.includes(member));
      });
      // mark the notification as read
      const updatedNotifications = notifications.map((n) =>
        n.senderId == notification.senderId
          ? { ...notification, isRead: true }
          : n
      );
      updateCurrentChat(desiredChat);
      setNotifications(updatedNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        otherUsers,
        allUsers,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendMessage,
        onlineUsers,
        notifications,
        markAllAsRead,
        markNotificationAsRead,
        isNotificationOpen,
        setIsNotificationOpen,
        closeNotifications,
        clearChatNotifications
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
