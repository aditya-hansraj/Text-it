import { createContext, useCallback, useEffect, useState } from "react"
import { baseUrl, getRequest, postRequest } from "../utils/services"

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [otherUsers, setOtherUsers] = useState([]);

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
                
                if(response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(response); 
            }
        }
        getUserChats();
    }, [user]);

    const createChat = useCallback(async (firstId, secondId) => {
        // creates a new chat between two users and returns the chat object
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({firstId, secondId}));

        if(response.error) return console.log('Error creating chat !', response);

        setUserChats((prev) => [...prev, response]);
    }, []);

    return (
        <ChatContext.Provider 
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                otherUsers,
                createChat
            }}
        >
            { children }
        </ChatContext.Provider>
    );
};