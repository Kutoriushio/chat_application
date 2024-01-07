import { unstable_noStore } from "next/cache";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <ConversationList initialConversations={conversations} users={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
