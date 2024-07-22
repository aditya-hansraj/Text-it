import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/chatContext"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLastmessage = chat => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {   
        const getMessage = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if(response.error) return;

            const lastMessage = response[response?.length - 1];

            setLatestMessage(lastMessage);
        }
        getMessage();
    }, [newMessage, notifications])
    return { latestMessage };
};