import React from "react";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getUserByIds from "@/app/actions/getUserByIds";
import AllFriendsLayout from "./components/AllFriendsLayout";

const AllFriends = async () => {
  const currentUser = await getCurrentUser();
  const users = await getUserByIds(currentUser?.friendIds!);
  return <AllFriendsLayout users={users} label="My friends" />;
};

export default AllFriends;
