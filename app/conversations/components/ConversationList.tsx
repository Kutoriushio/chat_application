"use client";

import { FullConversationType, FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import useConversation from "@/app/hooks/useConverstaion";
import { User } from "@prisma/client";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { useRouter } from "next/navigation";

interface ConversationListProps {
  initialConversations: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialConversations,
  users,
}) => {
  const session = useSession();
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversationId, isOpen } = useConversation();
  // const router = useRouter();

  const pusherChannel = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherChannel) {
      return;
    }
    pusherClient.subscribe(pusherChannel);

    const newConversationHandler = (conversation: FullConversationType) => {
      setConversations((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateConversationHandler = (data: {
      id: string;
      messages: FullMessageType[];
    }) => {
      setConversations((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === data.id) {
            return {
              ...currentConversation,
              messages: data.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeConversationHandler = (conversation: FullConversationType) => {
      setConversations((current) => {
        return [
          ...current.filter(
            (currentConversation) => currentConversation.id !== conversation.id
          ),
        ];
      });
      // router.push("/conversations");
      // router.refresh();
    };

    pusherClient.bind("new-conversation", newConversationHandler);
    pusherClient.bind("update-conversation", updateConversationHandler);
    pusherClient.bind("remove-conversation", removeConversationHandler);

    return () => {
      pusherClient.unsubscribe(pusherChannel);
      pusherClient.unbind("new-conversation", newConversationHandler);
      pusherClient.unbind("update-conversation", updateConversationHandler);
      pusherClient.unbind("remove-conversation", removeConversationHandler);
    };
  }, [pusherChannel]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "w-full block left-0"
        )}
      >
        <div className="px-5">
          <div className="pt-4 mb-4 flex justify-between">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer p-2 bg-gray-100 rounded-full text-gray-600 hover:opacity-75 transition"
            >
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
    </>
  );
};

export default ConversationList;
