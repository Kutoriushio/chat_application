import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  conversationId: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await Promise.all(
      existingConversation.users.map(async (user) => {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            conversationIds: user.conversationIds.filter(
              (id) => id !== conversationId
            ),
            seenMessageIds: user.seenMessageIds.filter(
              (id) =>
                !existingConversation.messages.some(
                  (message) => message.id === id
                )
            ),
          },
        });
      })
    );

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    await Promise.all(
      existingConversation.users.map(async (user) => {
        if (user.email) {
          await pusherServer.trigger(
            user.email,
            "remove-conversation",
            existingConversation
          );
        }
      })
    );
    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
