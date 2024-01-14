"use client";
import React from "react";
import { FiUsers } from "react-icons/fi";
import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface DesktopLayoutProps {
  users: User[];
  label: string;
  request?: boolean;
}
const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  users,
  label,
  request,
}) => {
  return (
    <div className="hidden lg:pl-80 lg:block h-full">
      <div className="h-full bg-[#f5f6fa]">
        <div className="flex text-sm leading-6 font-semibold text-black gap-x-3 p-6">
          <FiUsers className="h-6 w-6" />
          <span>{label}</span>
        </div>
        <div className="flex gap-6 flex-wrap p-5 w-full">
          {users.map((user) => (
            <UserBox key={user.email} user={user} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
