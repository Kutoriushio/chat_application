import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { email } = body;
    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!addUser) {
      return new NextResponse("User not found", { status: 400 });
    }

    const isSentRequest = addUser.friendRequestReceivedIds.includes(
      currentUser.id
    );

    if (isSentRequest) {
      return new NextResponse("Already sent request", { status: 400 });
    }

    if (email === currentUser.email) {
      return new NextResponse("Invaild data", { status: 400 });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friendRequestsSent: {
          connect: {
            id: addUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(email, "receive-request", updateUser);

    return NextResponse.json(updateUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
