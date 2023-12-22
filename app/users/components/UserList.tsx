"use client";

import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 block overflow-y-auto border-r border-gray-200 w-full left-0">
      <div className="px-5">
        <div className="flex flex-col">
          <div className="text-2xl font-bold py-4 text-neutral-800">People</div>
        </div>

        {users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
