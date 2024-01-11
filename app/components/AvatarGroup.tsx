import { User } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import React, { use } from "react";

interface AvatarGroupProps {
  users: User[];
  image: string | null;
}
const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, image }) => {
  if (image) {
    return (
      <div className="relative w-9 h-9 md:h-11 md:w-11 overflow-hidden rounded-full inline-block">
        <Image
          fill
          src={image}
          alt="avatar"
          className="object-cover object-top"
        />
      </div>
    );
  }
  const sliceUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[10px]",
    1: "bottom-0 left-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative w-9 h-9 md:h-11 md:w-11">
      {sliceUsers.map((user, index) => (
        <div
          key={user.id}
          className={clsx(
            "absolute w-[17.5px] h-[17.5px] md:w-[21px] md:h-[21px] rounded-full inline-block overflow-hidden",
            positionMap[index as keyof typeof positionMap]
          )}
        >
          <Image
            fill
            src={user?.image || "/images/placeholder.jpg"}
            alt="avatar"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
