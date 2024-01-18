"use client";
import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { User } from "@prisma/client";

import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { useRouter } from "next/navigation";
import UserBox from "../../components/UserBox";
import useActiveList from "@/app/hooks/useActiveList";

interface OnlineFriendsLayoutProps {
  users: User[];
  label: string;
}
const OnlineFriendsLayout: React.FC<OnlineFriendsLayoutProps> = ({
  users,
  label,
}) => {
  const { members } = useActiveList();
  const onlineUsers = users.filter((user) => members.includes(user.email!));
  const [onlineFriendsList, setOnlineFriendsList] =
    useState<User[]>(onlineUsers);

  const session = useSession();
  const pusherChannel = session.data?.user?.email;
  const router = useRouter();
  useEffect(() => {
    if (!pusherChannel) {
      return;
    }
    pusherClient.subscribe(pusherChannel);

    const acceptRequestHandler = (updateUser: User) => {
      setOnlineFriendsList((prev) => {
        if (members.includes(updateUser.email!)) {
          return [...prev, updateUser];
        }
        return prev;
      });

      const deleteFriendHandler = (updateUser: User) => {
        setOnlineFriendsList((prev) =>
          prev.filter((current) => current.id !== updateUser.id)
        );
      };

      pusherClient.bind("accept-request", acceptRequestHandler);
      pusherClient.bind("delete-friend", deleteFriendHandler);
      return () => {
        pusherClient.unsubscribe(pusherChannel);
        pusherClient.unbind("accept-request", acceptRequestHandler);
        pusherClient.unbind("delete-friend", deleteFriendHandler);
      };
    };
  }, [router, pusherChannel, members]);

  return (
    <div className="hidden lg:pl-80 lg:block h-full">
      <div className="h-full bg-[#f5f6fa]">
        <div className="flex text-sm leading-6 font-semibold text-black gap-x-3 p-6">
          <FiUsers className="h-6 w-6" />
          <span>{label}</span>
        </div>
        <div className="flex gap-6 flex-wrap p-5 w-full">
          {onlineFriendsList.map((user: User) => (
            <UserBox key={user.email} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default OnlineFriendsLayout;
