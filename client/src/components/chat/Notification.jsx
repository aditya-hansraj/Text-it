import { useContext, useState } from "react";
import { BiSolidNotification } from "react-icons/bi";
import { RiNotification3Fill } from "react-icons/ri";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import { getUnreadNotifications } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const { user } = useContext(AuthContext);
  const { notifications, userChats, allUsers, markAllAsRead, markNotificationAsRead, isNotificationOpen, setIsNotificationOpen, closeNotifications } =
    useContext(ChatContext);
  const unreadNotifications = getUnreadNotifications(notifications);
  // to add property senderName to all the notifications
  const updatedNotifications = notifications.map((notification) => {
    const sender = allUsers?.find((user) => user?._id == notification.senderId);
    return {
      ...notification,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
        <RiNotification3Fill fontSize={25} color="#E4B000" />
        {unreadNotifications.length && (
          <span className="notification-count">
            <span>{unreadNotifications.length}</span>
          </span>
        )}
      </div> 
      {isNotificationOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => {
                markAllAsRead(notifications);
              }}
            >
              mark all as read
            </div>
          </div>
          {updatedNotifications.length ? (
            updatedNotifications.map((notification, index) => (
              <div
                key={index}
                className={
                  notification.isRead ? "notification" : "notification not-read"
                }
                onClick={
                  () => {
                    markNotificationAsRead(notification, userChats, user, notifications);
                    closeNotifications()
                  }
                }
              >
                <span>{`${notification.senderName} sent you a message`}</span>
                <span className="notification-time">
                  {moment(notification.date).calendar()}
                </span>
              </div>
            ))
          ) : (
            <span className="notification">No Notification</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
