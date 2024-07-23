import { useContext } from "react";
import { Container, Stack } from "react-bootstrap"
import { ChatContext } from "../context/chatContext"
import { AuthContext } from "../context/AuthContext"
import UserChat from "../components/chat/UserChat" 
import OtherUsers from "../components/chat/OtherUsers";
import ChatBox from "../components/chat/ChatBox";
import { Helmet } from 'react-helmet';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat, closeNotifications } = useContext(ChatContext);
    return (
        <>
        <Helmet>
            <title>Text-it</title>
        </Helmet>
        <Container onClick={closeNotifications}>
            <OtherUsers />
            {!userChats?.length 
                ? null  
                : <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading Chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => {updateCurrentChat(chat)}}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatBox /> 
                </Stack>
            }
        </Container>
        </>
    );
}
 
export default Chat;