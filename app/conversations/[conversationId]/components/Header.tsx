"use client";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const otherUser = useOtherUser(conversation);
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Online";
  }, [conversation]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        statusText={statusText}
      />
      <div className="w-full py-3 px-2 lg:px-6 flex justify-between items-center bg-white border-b-[1px] shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block cursor-pointer text-sky-500 hover:text-sky-600 transition"
          >
            <HiChevronLeft size={32} />
          </Link>
          <div className="mt-1.5">
            <Avatar user={otherUser} />
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-gray-900">
              {conversation.name || otherUser.name}
            </p>
            <p className="text-sm text-neutral-800">{statusText}</p>
          </div>
        </div>

        <RxHamburgerMenu
          size={32}
          className="cursor-pointer hover:text-sky-600 transition"
          onClick={() => setDrawerOpen(true)}
        />
      </div>
    </>
  );
};

export default Header;
