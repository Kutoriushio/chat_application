"use client";
import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { User } from "@prisma/client";

import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { useRouter } from "next/navigation";
import UserBox from "../../components/UserBox";

interface FriendRequestsLayoutProps {
  users: User[];
  label: string;
  request: boolean;
}
const FriendRequestsLayout: React.FC<FriendRequestsLayoutProps> = ({
  users,
  label,
  request,
}) => {
  const [friendRequestsList, setFriendRequestsList] = useState<User[]>(users);

  const session = useSession();
  const pusherChannel = session.data?.user?.email;
  const router = useRouter();
  useEffect(() => {
    router.refresh();
    if (!pusherChannel) {
      return;
    }
    pusherClient.subscribe(pusherChannel);

    const receiveRequestHandler = (updateUser: User) => {
      setFriendRequestsList((prev) => {
        return [updateUser, ...prev];
      });
    };

    const handleRequestHandler = (userId: string) => {
      setFriendRequestsList((prev) => {
        return [
          ...prev.filter((user) => {
            user.id !== userId;
          }),
        ];
      });
    };

    pusherClient.bind("receive-request", receiveRequestHandler);
    pusherClient.bind("handle-request", handleRequestHandler);
    return () => {
      pusherClient.unsubscribe(pusherChannel);
      pusherClient.unbind("receive-request", receiveRequestHandler);
      pusherClient.unbind("handle-request", handleRequestHandler);
    };
  }, [router, pusherChannel]);

  return (
    <div className="hidden lg:pl-80 lg:block h-full">
      <div className="h-full bg-[#f5f6fa]">
        <div className="flex text-sm leading-6 font-semibold text-black gap-x-3 p-6">
          <FiUsers className="h-6 w-6" />
          <span>{label}</span>
        </div>
        <div className="flex gap-6 flex-wrap p-5 w-full">
          {friendRequestsList.map((user: User) => (
            <UserBox key={user.email} user={user} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default FriendRequestsLayout;
