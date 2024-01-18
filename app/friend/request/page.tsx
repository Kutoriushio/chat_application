import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUserByIds from "@/app/actions/getUserByIds";
import FriendRequestsLayout from "./components/FriendRequestsLayout";

const FriendRequest = async () => {
  const currentUser = await getCurrentUser();
  const users = await getUserByIds(currentUser?.friendRequestReceivedIds!);
  return <FriendRequestsLayout users={users} label="Friend requests" request />;
};

export default FriendRequest;
