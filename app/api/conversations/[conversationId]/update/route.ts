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
  const currentUser = await getCurrentUser();
  const { conversationId } = params;
  const body = await request.json();
  const { name, image, members } = body;
  if (!currentUser?.email && !currentUser?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!name) {
    return new NextResponse("Invalid data", { status: 402 });
  }

  if (!members || members.length <= 2) {
    return new NextResponse("Invalid data", { status: 400 });
  }

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: true,
    },
  });

  if (!existingConversation) {
    return new NextResponse("Invalid ID", { status: 404 });
  }

  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      name: name,
      image: image,
      users: {
        set: [],
        connect: members.map((member: { value: string }) => ({
          id: member.value,
        })),
      },
    },
    include: {
      users: true,
      messages: true,
    },
  });

  const addedUsers = updatedConversation.users.filter(
    (user) => !existingConversation.userIds.includes(user.id)
  );

  const removedUsers = existingConversation.users.filter(
    (user) => !updatedConversation.userIds.includes(user.id)
  );

  const otherUsers = existingConversation.users.filter(
    (user) => !removedUsers.includes(user)
  );

  await Promise.all(
    otherUsers.map(async (user) => {
      if (user.email) {
        await pusherServer.trigger(
          user.email,
          "update-group-conversation",
          updatedConversation
        );
      }
    })
  );

  await Promise.all(
    addedUsers.map(async (user) => {
      if (user.email) {
        await pusherServer.trigger(
          user.email,
          "new-conversation",
          updatedConversation
        );
      }
    })
  );

  await Promise.all(
    removedUsers.map(async (user) => {
      if (user.email) {
        await pusherServer.trigger(
          user.email,
          "remove-conversation",
          updatedConversation
        );
      }
    })
  );

  return NextResponse.json(updatedConversation);
}
