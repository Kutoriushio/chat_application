"use client";
import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { BsChatLeftText, BsChatRightText } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
    axios.post("/api/conversations", { userId: user.id }).then((data) => {
      router.push(`/conversations/${data.data.id}`);
      router.refresh();
    });
  }, [user, router]);
  return (
    <div className="w-[calc(50%-12px)] 2xl:w-[calc(25%-18px)] xl:w-[calc(33.33%-16px)] h-32 bg-[#fefefe] p-5 rounded-xl relative">
      <div className="flex items-center gap-x-3">
        <Avatar user={user} />
        <div className="font-medium text-gray-900">{user.name}</div>
      </div>
      <div className="absolute right-0 bottom-0">
        <div className="flex gap-x-4 p-2 items-center justify-center">
          <BsChatRightText
            className="cursor-pointer rounded-md w-6 h-6 p-1 hover:bg-gray-200"
            onClick={handleClick}
          />
          <FiUserX className="cursor-pointer rounded-md w-6 h-6 p-1 hover:bg-gray-200 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
