import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Container, Stack, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { BiSolidSend } from "react-icons/bi";
import ChatInput from './ChatInput';

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    messagesError,
    sendMessage,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const loaderStyle = {
    borderColor: "#E4A11B",
    display: "block",
    margin: "0 auto",
  };

  const [textMsg, setTextMsg] = useState("");

  if (!recipientUser)
    return (
      <Container
        style={{ height: "80vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        <h1>Text-it</h1>
      </Container>
    );
  if (isMessagesLoading)
    return (
      <Container
        style={{ height: "80vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        <ClipLoader
          loading={isMessagesLoading}
          cssOverride={loaderStyle}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Container>
    );
  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`message flex-grow-0 ${
                message.senderId == user?._id
                  ? "self align-self-end"
                  : "align-self-start"
              }`}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <ChatInput sendMessage={sendMessage} textMsg={textMsg} setTextMsg={setTextMsg} user={user} currentChat={currentChat} />
      {/* <Form onSubmit={(event) => {
          event.preventDefault()
          sendMessage(textMsg, user, currentChat._id, setTextMsg)
        }
      }>
        <Stack
          direction="horizontal"
          gap={0}
          className="chat-input flex-grow-0"
        >
          <InputEmoji
            value={textMsg}
            onChange={setTextMsg}
            fontFamily="nunito"
            borderColor="rgba(72, 112, 223, 0.2)"
          />
          <button type="submit" className="send-btn" >
            <BiSolidSend
              style={{ width: "23px", height: "23px", border: "yellow" }}
            />
          </button>
        </Stack>
      </Form> */}
    </Stack>
  );
};

export default ChatBox;
