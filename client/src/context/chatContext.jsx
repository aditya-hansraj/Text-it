import { createContext, useCallback, useEffect, useState } from "react"
import { baseUrl, getRequest, postRequest } from "../utils/services"
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [otherUsers, setOtherUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextError, setSendTextError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    console.log(onlineUsers);
    //initialize socket
    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // add online users 
    useEffect(() => {
        if(!socket) return;
        socket.emit('addNewUser', user?._id);  

        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res); 
        });

        return () => {
            socket.off("getOnlineUsers");
        }; 
    }, [socket]);

    // send message
    useEffect(() => {
        if(!socket) return;

        const recipientId = currentChat?.members.find(id => id != user ?._id); 
        socket.emit("sendMessage", {...newMessage, recipientId});
    }, [newMessage]);

    // get Message
    useEffect(() => {
        if(!socket) return;

        socket.on("getMessage", res => {
            if(currentChat?._id != res.chatId) return;
            setMessages(prev => [...prev, res]);
        });

        return () => {
            socket.off("getMessage");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        const getOtherUsers = async () => {
            //array of all users from the database
            const response = await getRequest(`${baseUrl}/users`);

            if(response.error) return console.log(`Error fetching users ! ${response}`);
            // filters out the logged in user itself and the users those who already have a chat with the user
            const othrUsers = response.filter(u => {
                let isChatCreated = false;
                if(u._id == user?._id) return false; // excluding the user
                if(userChats) {
                    isChatCreated = userChats?.some(chat => {
                        return chat.members[0] == u._id || chat.members[1] == u._id;
                    })
                } // excluding the users that already have a chat with current user
                return !isChatCreated;
            });
            setOtherUsers(othrUsers);
        }
        getOtherUsers();
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id) {
                setUserChatsError(null);
                setIsUserChatsLoading(true);
                // array of all the users that the current signed in user has a chat with
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false);
                if(response.error) return setUserChatsError(response);
                setUserChats(response); 
            }
        }
        getUserChats();
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            setMessagesError(null);
            setIsMessagesLoading(true);
            // getMessages for the current selected chat
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);
            if(response.error) return setMessagesError(response);
            setMessages(response);
        }
        getMessages();
    }, [currentChat]);

    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat); 
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        // creates a new chat between two users and returns the chat object
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({firstId, secondId}));

        if(response.error) return console.log('Error creating chat !', response);

        setUserChats((prev) => [...prev, response]);
    }, []);

    const sendMessage = useCallback(async (textMsg, sender, currentChatId, setTextMsg) => {
        if(!textMsg) return;

        const response = await postRequest(
            `${baseUrl}/messages`, 
            JSON.stringify({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMsg
            })
        );

        if(response.error) return setSendTextError(response);

        setNewMessage(response);
        setMessages(prev => [...prev, response]);
        setTextMsg('');
    }, []);

    return (
        <ChatContext.Provider 
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                otherUsers,
                createChat,
                currentChat,
                updateCurrentChat,
                messages,
                isMessagesLoading,
                messagesError,
                sendMessage,
                onlineUsers
            }}
        >
            { children }
        </ChatContext.Provider>
    );
};