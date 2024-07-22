import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import user_pfp from './../../assets/user_pfp.svg'
import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { getUnreadNotifications } from "../../utils/unreadNotifications";
import { useFetchLastmessage } from "../../hooks/useFetchLastMessage";
import moment from 'moment';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications, closeNotifications, clearChatNotifications } = useContext(ChatContext);
    const { latestMessage } = useFetchLastmessage(chat);

    // get all unread notifications for the signed in users
    const unreadNotifications = getUnreadNotifications(notifications);

    // get unread notifications for this particular chat i.e UserChat
    const thisChatNotifications = unreadNotifications?.filter(
        notification => notification.senderId == recipientUser?._id
    );

    const truncateText = text => text.length > 20 ? text.substring(0, 20) + "..." : text;

    return ( 
        <Stack direction="horizontal" 
        gap={3} 
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        onClick={() => {
            closeNotifications();
            if(thisChatNotifications?.length)
                clearChatNotifications(thisChatNotifications, notifications);
        }}
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={ user_pfp } height="40px" />
                </div>
                <div className="text-content">
                    <div className="name">{ recipientUser?.name }</div>
                    <div className="text">
                        {
                            latestMessage?.text &&
                            <span>
                                {truncateText(latestMessage?.text)}
                            </span>
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {
                        moment(latestMessage?.createdAt).calendar()
                    }
                </div>
                <div className={thisChatNotifications.length ? "this-user-notifications" : ""}>
                    {
                        thisChatNotifications.length > 0 ? thisChatNotifications.length : ''
                    }
                </div>
                <span className={onlineUsers?.some(user => user.userId == recipientUser?._id) ? "user-online" : ""}></span>
            </div>
        </Stack> 
    );
}
 
export default UserChat;