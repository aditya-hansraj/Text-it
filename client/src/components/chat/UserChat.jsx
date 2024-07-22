import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import user_pfp from './../../assets/user_pfp.svg'
import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);
    return ( 
        <Stack direction="horizontal" 
        gap={3} 
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={ user_pfp } height="40px" />
                </div>
                <div className="text-content">
                    <div className="name">{ recipientUser?.name }</div>
                    <div className="text">txt</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">11/11/21</div>
                <div className="this-user-notifications">9+</div>
                <span className={onlineUsers?.some(user => user.userId == recipientUser?._id) ? "user-online" : ""}></span>
            </div>
        </Stack> 
    );
}
 
export default UserChat;