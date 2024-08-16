import React, { SetStateAction } from "react";

import { Message } from "@/models";

import { HiMiniArrowPath } from "react-icons/hi2";

interface Props {
  title: string;
  //setChatMessages: (messages: Message[]) => void;
  setChatMessages: React.Dispatch<SetStateAction<Message[]>>;
}

export function Header({ title, setChatMessages }: Props) {
  const resetChat = () => {
    // Reset the messages in the chat
    setChatMessages([]);
  };
  return (
    <header className="flex flex-row justify-between items-center border-b border-grey py-2 m-3">
      <p className="hidden md:inline"></p>
      <p className="text-md md:text-lg text-white bg-duck-red px-2 py-1 font-semibold animate-pulse">
        {title}
      </p>
      <div className="group relative flex">
        <button
          type="button"
          onClick={() => resetChat()}
          className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center mr-5"
        >
          <HiMiniArrowPath className="text-gray-400 w-5 md:w-7 h-5 md:h-7" />
        </button>
        <span className="absolute top-0 mt-9 scale-0 transition-all rounded bg-white p-2 text-xs text-gray-500 group-hover:scale-100">
          Refresh
        </span>
      </div>
    </header>
  );
}
