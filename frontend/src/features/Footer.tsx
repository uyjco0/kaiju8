import { Message } from "@/models";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

interface Props {
  userName: string;
  sendMessage: (message: any, keep?: boolean | undefined) => void;
  encodeMessage: (msg: Message) => string;
}

interface FormElements extends HTMLFormControlsCollection {
  messageBox: HTMLInputElement;
}

interface CustomFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function Footer({ userName, sendMessage, encodeMessage }: Props) {
  // Handler for the form's submit
  const submitMessage = (e: React.FormEvent<CustomFormElement>) => {
    // Avoid cascading the event
    e.preventDefault();

    // Do nothing if there is no message
    if (e.currentTarget.elements.messageBox.value == "") {
      return;
    }

    // Encode the message to a string and send it to the Chat backend
    sendMessage(
      encodeMessage({
        text: e.currentTarget.elements.messageBox.value,
        sentBy: userName,
        sentAt: new Date(),
      })
    );

    // Clean the input field
    e.currentTarget.elements.messageBox.value = "";
  };

  return (
    <footer className="w-full text-center border-t border-grey p-4">
      <form
        className="flex flex-row relative w-full items-center"
        onSubmit={(e) => submitMessage(e as React.FormEvent<CustomFormElement>)}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <HiOutlinePaperAirplane className="w-4 h-4" />
        </div>
        <input
          type="text"
          className="w-full p-1.5 pl-10 text-sm text-gray-600 border border-gray-300 rounded-lg bg-white mr-5 focus:outline-none focus:ring-0 focus:border-duck-red-light"
          id="messageBox"
        />
        <button
          type="submit"
          className="text-white bg-duck-red px-5 py-2 rounded-xl active:translate-y-0.5 active:translate-x-0.5 hover:bg-duck-red-light hover:text-black transition-all"
          title="refresh"
        >
          Send
        </button>
      </form>
    </footer>
  );
}
