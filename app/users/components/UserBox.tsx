import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

interface UserBoxProps {
  user: User;
}
const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: user.id })
      .then((data) => {
        console.log(data.data);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div
      className="w-full relative gap-3 flex items-center p-2 bg-white hover:bg-sky-200 rounded-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <Avatar user={user} />
      <div className="min-w-0 flex-1 mb-1">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
      </div>
    </div>
  );
};

export default UserBox;
