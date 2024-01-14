"use client";

import { User } from "@prisma/client";
import React, { useState } from "react";
import MobileList from "./MobileList";
import DesktopList from "./DesktopList";
import { FiUserPlus } from "react-icons/fi";
import AddFriendModal from "./AddFriendModal";

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <MobileList users={users} />
          <DesktopList users={users} />
        </div>
      </div>
    </>
  );
};

export default UserList;
