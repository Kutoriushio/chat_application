import React from "react";
import CollapsiblePanel from "./CollapsiblePanel";
import { User } from "@prisma/client";

interface MobileListProps {
  requestUsers: User[];
  onlineFriends: User[];
  allFriends: User[];
}
const MobileList: React.FC<MobileListProps> = ({
  requestUsers,
  onlineFriends,
  allFriends,
}) => {
  return (
    <div className="flex flex-col gap-[6px] lg:hidden">
      <CollapsiblePanel users={onlineFriends} label="Online friends" />
      <CollapsiblePanel users={allFriends} label="My friends" />
      <CollapsiblePanel users={requestUsers} request label="Friend Requests" />
    </div>
  );
};

export default MobileList;
