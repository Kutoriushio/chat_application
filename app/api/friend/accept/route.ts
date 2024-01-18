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

    const addUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!addUser?.email) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friendRequestsReceived: {
          disconnect: {
            id: userId,
          },
        },
        friends: {
          connect: {
            id: userId,
          },
        },
        friendOf: {
          connect: {
            id: userId,
          },
        },
      },
    });
    await Promise.all([
      pusherServer.trigger(currentUser.email, "handle-request", addUser.id),
      pusherServer.trigger(currentUser.email, "accept-request", addUser),
      pusherServer.trigger(addUser.email, "accept-request", updateUser),
    ]);
    return NextResponse.json(updateUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
