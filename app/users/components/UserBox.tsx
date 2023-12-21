import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import React from "react";

interface UserBoxProps {
  user: User;
}
const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  return (
    <div className="w-full relative gap-3 flex items-center p-2 bg-white hover:bg-sky-200 rounded-lg transition cursor-pointer">
      <Avatar user={user} />
      <div className="min-w-0 flex-1 mb-1">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
      </div>
    </div>
  );
};

export default UserBox;
