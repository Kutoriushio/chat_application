"use client";
import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { User } from "@prisma/client";

import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { useRouter } from "next/navigation";
import UserBox from "../../components/UserBox";

interface AllFriendsLayoutProps {
  users: User[];
  label: string;
}
const AllFriendsLayout: React.FC<AllFriendsLayoutProps> = ({
  users,
  label,
}) => {
  const [allFriendsList, setAllFriendsList] = useState<User[]>(users);

  const session = useSession();
  const pusherChannel = session.data?.user?.email;
  const router = useRouter();
  useEffect(() => {
    if (!pusherChannel) {
      return;
    }
    pusherClient.subscribe(pusherChannel);

    const acceptRequestHandler = (updateUser: User) => {
      setAllFriendsList((prev) => [...prev, updateUser]);
      router.refresh();
    };

    const deleteFriendHandler = (updateUser: User) => {
      setAllFriendsList((prev) =>
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
  }, [router, pusherChannel]);

  return (
    <div className="hidden lg:pl-80 lg:block h-full">
      <div className="h-full bg-[#f5f6fa]">
        <div className="flex text-sm leading-6 font-semibold text-black gap-x-3 p-6">
          <FiUsers className="h-6 w-6" />
          <span>{label}</span>
        </div>
        <div className="flex gap-6 flex-wrap p-5 w-full">
          {allFriendsList.map((user: User) => (
            <UserBox key={user.email} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AllFriendsLayout;
