import React, { SetStateAction } from "react";
import { motion } from "framer-motion";
import { Message } from "@/models";

interface Props {
  setIsVisible: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
  sendNewMessage: (message: Message) => void;
}

interface FormElements extends HTMLFormControlsCollection {
  userName: HTMLInputElement;
}

interface CustomFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function NamePromptModal({
  setIsVisible,
  setUserName,
  sendNewMessage,
}: Props) {
  const submitName = (e: React.FormEvent<CustomFormElement>) => {
    // Avoid cascading the event
    e.preventDefault();
    if (e.currentTarget.elements.userName.value == "") {
      return;
    }

    // Set the user name for the chat
    setUserName(e.currentTarget.elements.userName.value);

    // The system sends a message to the new user
    sendNewMessage({
      text: "Welcome " + e.currentTarget.elements.userName.value + "!",
      sentBy: "System",
      sentAt: new Date(),
    });

    // Close the modal
    setIsVisible(false);
  };

  return (
    <div className="z-40 transition-all flex flex-col justify-center items-center h-screen w-screen absolute">
      <motion.div
        className="z-50 w-4/5 h-3/5 lg:w-2/5 lg:h-2/5 bg-duck-red flex flex-col justify-center items-center rounded-xl shadow-md"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <form
          className="flex gap-4 flex-col items-center"
          onSubmit={(e) => submitName(e as React.FormEvent<CustomFormElement>)}
        >
          <p className="text-lg lg:text-2xl text-white">
            Hi! What's your name?
          </p>
          <input
            type="text"
            className="px-5 py-2 rounded-xl required"
            id="userName"
          />
          <button
            type="submit"
            className="text-duck-red bg-duck-green px-5 py-2 rounded-xl active:translate-y-0.5 active:translate-x-0.5 hover:bg-duck-green-light hover:text-black transition-all"
            title="refresh"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
}
