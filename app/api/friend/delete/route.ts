import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    const { userId } = body;

    const deleteFriend = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!deleteFriend?.email) {
      return new NextResponse("Invaild data", { status: 400 });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friends: {
          disconnect: {
            id: userId,
          },
        },
        friendOf: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    await Promise.all([
      pusherServer.trigger(currentUser.email, "delete-friend", deleteFriend),
      pusherServer.trigger(deleteFriend.email, "delete-friend", updateUser),
    ]);
    return NextResponse.json(updateUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
