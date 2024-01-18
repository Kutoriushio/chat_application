"use client";

import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import MobileList from "./MobileList";
import DesktopList from "./DesktopList";
import { FiUserPlus } from "react-icons/fi";
import AddFriendModal from "./AddFriendModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/app/libs/pusher";
import useActiveList from "@/app/hooks/useActiveList";

interface UserListProps {
  requestUsers: User[];
  onlineFriends: User[];
  allFriends: User[];
}

const UserList: React.FC<UserListProps> = ({
  requestUsers,
  onlineFriends,
  allFriends,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { members } = useActiveList();
  const onlineUsers = onlineFriends.filter((user) =>
    members.includes(user.email!)
  );
  const [onlineFriendsList, setOnlineFriendsList] =
    useState<User[]>(onlineUsers);
  const [friendRequestsList, setFriendRequestsList] =
    useState<User[]>(requestUsers);
  const [allFriendsList, setAllFriendsList] = useState<User[]>(allFriends);
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

    const acceptRequestHandler = (updateUser: User) => {
      setAllFriendsList((prev) => [...prev, updateUser]);

      setOnlineFriendsList((prev) => {
        if (members.includes(updateUser.email!)) {
          return [...prev, updateUser];
        }
        return prev;
      });
      router.refresh();
    };

    const deleteFriendHandler = (updateUser: User) => {
      setAllFriendsList((prev) =>
        prev.filter((current) => current.id !== updateUser.id)
      );

      setOnlineFriendsList((prev) =>
        prev.filter((current) => current.id !== updateUser.id)
      );
    };

    pusherClient.bind("accept-request", acceptRequestHandler);
    pusherClient.bind("delete-friend", deleteFriendHandler);
    pusherClient.bind("receive-request", receiveRequestHandler);
    pusherClient.bind("handle-request", handleRequestHandler);
    return () => {
      pusherClient.unsubscribe(pusherChannel);
      pusherClient.unbind("receive-request", receiveRequestHandler);
      pusherClient.unbind("handle-request", handleRequestHandler);
      pusherClient.unbind("accept-request", acceptRequestHandler);
      pusherClient.unbind("delete-friend", deleteFriendHandler);
    };
  }, [router, pusherChannel, members]);
  return (
    <>
      <AddFriendModal
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
      <div className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 block overflow-y-auto border-r border-gray-200 w-full left-0">
        <div className="px-5">
          <div className="flex justify-between pt-4 mb-4">
            <div className="text-2xl font-bold text-neutral-800">Friends</div>
            <div
              className="cursor-pointer p-2 bg-gray-100 rounded-full text-gray-600 hover:opacity-75 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <FiUserPlus size={20} />
            </div>
          </div>
          <MobileList
            requestUsers={friendRequestsList}
            onlineFriends={onlineFriendsList}
            allFriends={allFriendsList}
          />
          <DesktopList />
        </div>
      </div>
    </>
  );
};

export default UserList;
