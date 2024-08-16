import React from "react";
import { motion } from "framer-motion";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { Message } from "@/models";

import configData from "@/config.json";

import { NamePromptModal } from "@/features/NamePromptModal";
import { Header } from "@/features/Header";
import { ChatContent } from "@/features/ChatContent";
import { Footer } from "@/features/Footer";
import { ErrorModal } from "./features/ErrorModal";

export function App() {
  // Control the modal to set the user's name
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

  // Control the name of the user that is using the chat
  const [userName, setUserName] = React.useState<string>("");

  // Control the messages being displayed in the Chat
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);

  // Control the Websocket management
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    configData.WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  // Update the chat messages with a new message
  const sendNewMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  // It will be used as a reference to the div that contain the chat messages
  const elementRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  React.useLayoutEffect(() => {
    if (elementRef !== null && elementRef.current !== null) {
      // It scrolls the div with the chat messages to the last message
      elementRef.current.scroll(0, elementRef.current.scrollHeight);
    }
  }, [chatMessages]);

  // Encode a chat message into a 'string'
  function encodeMessage(msg: Message) {
    return (
      msg.text +
      configData.MSG_SEP +
      msg.sentBy +
      configData.MSG_SEP +
      msg.sentAt.toString()
    );
  }

  // Decode a string into an object with type 'Message'
  function decodeMessage(msg: string) {
    const msgElems = msg.split(configData.MSG_SEP);
    const msgObj: Message = {
      text: msgElems[0],
      sentBy: msgElems[1],
      sentAt: new Date(msgElems[2]),
    };
    return msgObj;
  }

  // Run when a new WebSocket message is received (lastMessage)
  React.useEffect(() => {
    if (lastMessage !== null && lastMessage.data != null) {
      const data: string = lastMessage.data;
      // Decode the received message and send it to the chat room
      sendNewMessage(decodeMessage(data));
    }
  }, [lastMessage]);

  return (
    <>
      {/* The modal to get the user name*/}
      {isVisible ? (
        <NamePromptModal
          setUserName={setUserName}
          setIsVisible={setIsVisible}
          sendNewMessage={sendNewMessage}
        />
      ) : null}
      {/* The chat room*/}
      {!isVisible && readyState === ReadyState.OPEN ? (
        <motion.div
          className="flex flex-col h-[100dvh] overflow-y-hidden"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Header title="Kaiju8" setChatMessages={setChatMessages} />
          <ChatContent
            messages={chatMessages}
            userName={userName}
            ref={elementRef}
          />
          <Footer
            userName={userName}
            sendMessage={sendMessage}
            encodeMessage={encodeMessage}
          />
        </motion.div>
      ) : null}
      {/* The error message*/}
      {!isVisible && readyState !== ReadyState.OPEN ? <ErrorModal /> : null}
    </>
  );
}
