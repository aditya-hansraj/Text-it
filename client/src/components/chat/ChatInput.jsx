import { useRef } from "react";
import { Form, Stack } from "react-bootstrap";
import { BiSolidSend } from "react-icons/bi";
import InputEmoji from "react-input-emoji"; 

const MyForm = ({ sendMessage, textMsg, setTextMsg, user, currentChat }) => {
  const formRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  return (
    <Form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage(textMsg, user, currentChat._id, setTextMsg);
      }}
    >
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
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="send-btn">
          <BiSolidSend
            style={{ width: "23px", height: "23px", border: "yellow" }}
          />
        </button>
      </Stack>
    </Form>
  );
};

export default MyForm;
