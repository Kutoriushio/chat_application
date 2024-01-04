"use client";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface ConversationBoxProps {
  conversation: FullConversationType;
  selected: boolean;
}
const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
}) => {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();
  const session = useSession();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [router, conversation]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];

    return messages[messages.length - 1];
  }, [conversation]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return true;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return true;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an Image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "relative w-full flex items-center space-x-3 p-2 hover:bg-sky-200 rounded-lg transition cursor-pointer",
        selected ? "bg-sky-200" : "bg-white"
      )}
    >
      {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1 mb-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900">
            {conversation.name || otherUser.name}
          </p>
          {lastMessage && (
            <p className="text-xs text-gray-400 font-light">
              {format(lastMessage.createdAt, "HH:mm")}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm truncate text-gray-500">{lastMessageText}</p>
          {!hasSeen && (
            <div className="rounded-full w-3 h-3 bg-red-500 flex justify-center items-center text-xs text-white"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
