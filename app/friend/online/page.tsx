import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUserByIds from "@/app/actions/getUserByIds";
import OnlineFriendsLayout from "./components/OnlineFriendsLayout";

const OnlineFriends = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return;
  }
  const users = await getUserByIds(currentUser.friendIds);
  return <OnlineFriendsLayout users={users} label="Online friends" />;
};

export default OnlineFriends;
