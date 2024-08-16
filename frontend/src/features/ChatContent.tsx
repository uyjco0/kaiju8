import { forwardRef, Fragment } from "react";

import { Message } from "@/models";

import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  userName: string;
}

export type Ref = HTMLDivElement;

export const ChatContent = forwardRef<Ref, Props>(
  ({ messages, userName }, ref) => {
    return (
      <div ref={ref} className="flex flex-col overflow-y-auto grow m-2">
        {messages.map((message: Message, index: number) => (
          <Fragment key={index}>
            <ChatMessage message={message} userName={userName} />
          </Fragment>
        ))}
      </div>
    );
  }
);
