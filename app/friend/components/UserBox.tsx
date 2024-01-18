import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FiUserX } from "react-icons/fi";
import { GrCheckmark } from "react-icons/gr";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

interface UserBoxProps {
  user: User;
  request?: boolean;
  mobile?: boolean;
}
const UserBox: React.FC<UserBoxProps> = ({ user, request, mobile }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChatClick = useCallback(() => {
    axios.post("/api/conversations", { userId: user.id }).then((data) => {
      router.push(`/conversations/${data.data.id}`);
      router.refresh();
    });
  }, [user, router]);

  const handleDenyClick = useCallback(() => {
    axios
      .post("/api/friend/deny", { userId: user.id })
      .then(() => router.refresh());
  }, [user, router]);

  const handleAcceptClick = useCallback(() => {
    axios.post("/api/friend/accept", { userId: user.id }).then(() => {
      toast.success(`${user.name} is your friend now!`);
      router.refresh();
    });
  }, [user, router]);

  const handleDeleteClick = useCallback(() => {
    axios
      .post("/api/friend/delete", { userId: user.id })
      .then(() => router.refresh());
  }, [user, router]);

  if (mobile) {
    return (
      <>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onClick={handleDeleteClick}
        />
        <div className="w-full relative gap-3 flex items-center p-2 bg-white  rounded-lg transition hover:bg-sky-200 hover:bg-opacity-70">
          <Avatar user={user} />
          <div className="min-w-0 flex-1 flex flex-col gap-[1px]">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {user.email}
            </p>
          </div>
          {request ? (
            <div className="flex gap-x-4 p-2 items-center justify-center">
              <RxCross1
                className="cursor-pointer rounded-full w-7 h-7 p-1 hover:bg-sky-200 text-red-500"
                onClick={handleDenyClick}
              />
              <GrCheckmark
                className="cursor-pointer rounded-full w-7 h-7 p-1 hover:bg-sky-200 text-green-500"
                onClick={handleAcceptClick}
              />
            </div>
          ) : (
            <div className="flex gap-x-4 p-2 items-center justify-center">
              <HiOutlineChatBubbleLeftEllipsis
                className="cursor-pointer rounded-lg w-7 h-7 p-1 hover:bg-sky-200 -scale-x-100"
                onClick={handleChatClick}
              />
              <FiUserX
                className="cursor-pointer rounded-lg w-7 h-7 p-1 hover:bg-sky-200 text-red-500"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClick={handleDeleteClick}
      />
      <div className="w-[calc(50%-12px)] 2xl:w-[calc(25%-18px)] xl:w-[calc(33.33%-16px)] h-32 bg-[#fefefe] p-5 rounded-2xl relative">
        <div className="flex items-center gap-x-3">
          <Avatar user={user} />
          <div className="flex flex-col gap-1">
            <div className="font-medium text-gray-900">{user.name}</div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {user.email}
            </p>
          </div>
        </div>
        <div className="absolute right-4 bottom-1">
          {request ? (
            <div className="flex gap-x-4 p-2 items-center justify-center">
              <RxCross1
                className="cursor-pointer rounded-lg w-6 h-6 p-1 hover:bg-gray-100 text-red-500 ring-1 ring-inset ring-red-500"
                onClick={handleDenyClick}
              />
              <GrCheckmark
                className="cursor-pointer rounded-lg w-6 h-6 p-1 hover:bg-gray-100 text-green-500 ring-1 ring-inset ring-green-500"
                onClick={handleAcceptClick}
              />
            </div>
          ) : (
            <div className="flex gap-x-4 p-2 items-center justify-center">
              <HiOutlineChatBubbleLeftEllipsis
                className="cursor-pointer rounded-lg w-7 h-7 p-1 hover:bg-gray-100 -scale-x-100"
                onClick={handleChatClick}
              />
              <FiUserX
                className="cursor-pointer rounded-lg w-7 h-7 p-1 hover:bg-gray-100 text-red-500"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBox;
