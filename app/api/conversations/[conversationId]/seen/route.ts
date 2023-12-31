import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

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

        await pusherServer.trigger(currentUser.email!, "update-conversation", {
            id: conversationId,
            messages: [updatedLastMessage]
        })
        // Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId, "update-message", updatedLastMessage)
        
        return NextResponse.json(updatedLastMessage)
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}
