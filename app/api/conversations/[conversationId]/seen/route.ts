import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        const {conversationId} = params
        if (!currentUser?.email && !currentUser?.id) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        })

        if(!conversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if(!lastMessage) {
            return NextResponse.json(conversation)
        }

        const updatedLastMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                sender: true,
                seen: true
            }
        })

        return NextResponse.json(updatedLastMessage)
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}
