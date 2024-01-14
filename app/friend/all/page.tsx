import getUsers from "@/app/actions/getUsers";
import React from "react";
import UserCard from "../components/UserCard";
import { FiUsers } from "react-icons/fi";

const AllFriends = async () => {
  const users = await getUsers();
  return (
    <div className="hidden lg:pl-80 lg:block h-full">
      <div className="h-full bg-[#f5f6fa]">
        <div className="flex text-sm leading-6 font-semibold text-black gap-x-3 p-6">
          <FiUsers className="h-6 w-6" />
          <span>My Friends</span>
        </div>
        <div className="flex gap-6 flex-wrap p-5 w-full">
          {users.map((user) => (
            <UserCard key={user.email} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFriends;
