import React from "react";
import CollapsiblePanel from "./CollapsiblePanel";
import { User } from "@prisma/client";

interface MobileListProps {
  users: User[];
}
const MobileList: React.FC<MobileListProps> = ({ users }) => {
  return (
    <div className="flex flex-col gap-[6px] lg:hidden">
      <CollapsiblePanel users={users} label="Online friends" />
      <CollapsiblePanel users={users} label="My friends" />
      <CollapsiblePanel users={users} label="Friend Requests" />
    </div>
  );
};

export default MobileList;
