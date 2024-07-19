import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";

const OtherUsers = () => {
    const { user } = useContext(AuthContext);
  const { otherUsers, createChat } = useContext(ChatContext);
  console.log(otherUsers);
  return (
    <>
      <div className="all-users">
        {otherUsers &&
          otherUsers.map((usr, index) => {
            return (
              <div className="single-user" key={index} onClick={() => {createChat(user?._id, usr._id)}}>
                {usr.name}
                <span className="user-online"></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default OtherUsers;
