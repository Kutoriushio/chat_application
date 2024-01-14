import getUsers from "@/app/actions/getUsers";
import React from "react";
import UserCard from "../components/UserCard";
import { FiUsers } from "react-icons/fi";
import DesktopLayout from "../components/DesktopLayout";

const AllFriends = async () => {
  const users = await getUsers();
  return <DesktopLayout users={users} label="My friends" />;
};

export default AllFriends;
