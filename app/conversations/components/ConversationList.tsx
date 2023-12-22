"use client";

import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import useConversation from "@/app/hooks/useConverstaion";
interface ConversationListProps {
  initialConversations: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialConversations,
}) => {
  const [conversations, setconversations] = useState(initialConversations);

  const { conversationId, isOpen } = useConversation();
  return (
    <div
      className={clsx(
        "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
        isOpen ? "hidden" : "w-full block left-0"
      )}
    >
      <div className="px-5">
        <div className="pt-4 mb-4 flex justify-between">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
          <div className="cursor-pointer p-2 bg-gray-100 rounded-full text-gray-600 hover:opacity-75 transition">
            <MdOutlineGroupAdd size={20} />
          </div>
        </div>
        {conversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            conversation={conversation}
            selected={conversation.id === conversationId}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
