import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface MessageBoxProps {
  data: FullMessageType;
  isLast: boolean;
}
const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();

  const isOwn = data.sender.email === session.data?.user?.email;

  const seenList = (data.seen || [])
    .filter((user) => data.sender.email !== user.email)
    .map((user) => user.name)
    .join(",");
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-lg py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "HH:mm")}
          </div>
        </div>
        <div className={message}>
          {data.image ? (
            <Image
              width="288"
              height="288"
              alt="image"
              src={data.image}
              className="cursor-pointer object-cover hover:scale-110 transition"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
