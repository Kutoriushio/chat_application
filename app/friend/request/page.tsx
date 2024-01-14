import React from "react";
import getUsers from "@/app/actions/getUsers";
import DesktopLayout from "../components/DesktopLayout";

const FriendRequest = async () => {
  const users = await getUsers();
  return <DesktopLayout users={users} label="Friend requests" request />;
};

export default FriendRequest;
