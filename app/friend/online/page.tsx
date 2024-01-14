import React from "react";
import getUsers from "@/app/actions/getUsers";
import DesktopLayout from "../components/DesktopLayout";

const OnlineFriends = async () => {
  const users = await getUsers();
  return <DesktopLayout users={users} label="Online friends" />;
};

export default OnlineFriends;
