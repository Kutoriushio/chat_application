import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AvatarProps {
  user: User;
}
const Avatar: React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className="relative">
      <div className="relative w-9 h-9 md:h-11 md:w-11 overflow-hidden rounded-full inline-block">
        <Image
          fill
          src={user?.image || "/images/placeholder.jpg"}
          alt="avatar"
          className="object-cover object-top"
        />
      </div>
      <span className="absolute ring-2 ring-white top-0 right-0 h-2 w-2 block bg-green-500 rounded-full md:h-3 md:w-3" />
    </div>
  );
};

export default Avatar;
