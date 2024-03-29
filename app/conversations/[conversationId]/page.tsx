import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getUsers from "@/app/actions/getUsers";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const users = await getUsers();
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <EmptyState />
      </div>
    );
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <Header conversation={conversation} users={users} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
