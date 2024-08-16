import { Message } from "@/models";

interface Props {
  message: Message;
  userName: string;
}

export function ChatMessage({ message, userName }: Props) {
  return (
    <div
      className={`py-2 flex flex-row ${
        message.sentBy === userName ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-2 w-fit py-3 flex flex-col rounded-lg text-gray-700 ${
          message.sentBy === userName
            ? "order-1 mr-2 bg-duck-green-light"
            : "order-2 ml-2 bg-duck-yellow"
        }`}
      >
        <span className="text-xs text-duck-red mb-2">
          {message.sentBy}&nbsp;-&nbsp;
          {new Date(message.sentAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="text-md grow-0 max-w-64 md:max-w-[55rem] lg:max-w-[95rem]">
          {message.text}
        </span>
      </div>
    </div>
  );
}
