import getCurrentUser from "../actions/getCurrentUser";
import getUserByIds from "../actions/getUserByIds";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const requestUsers = await getUserByIds(
    currentUser?.friendRequestReceivedIds!
  );
  const onlineFriends = await getUserByIds(currentUser?.friendIds!);
  const allFriends = await getUserByIds(currentUser?.friendIds!);
  return (
    <Sidebar>
      <UserList
        requestUsers={requestUsers!}
        onlineFriends={onlineFriends}
        allFriends={allFriends}
      />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
