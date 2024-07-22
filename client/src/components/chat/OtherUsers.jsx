import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";

const OtherUsers = () => {
    const { user } = useContext(AuthContext);
  const { otherUsers, createChat, onlineUsers } = useContext(ChatContext);
  return (
    <>
      <div className="all-users">
        {otherUsers &&
          otherUsers.map((usr, index) => {
            return (
              <div className="single-user" key={index} onClick={() => {createChat(user?._id, usr._id)}}>
                {usr.name}
                <span className={onlineUsers?.some(user => user.userId == usr._id) ? "user-online" : ""}></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default OtherUsers;
