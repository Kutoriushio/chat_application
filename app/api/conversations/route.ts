import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: NextRequest
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { userId, members, isGroup, name } = body;

        if (!currentUser?.email && !currentUser?.id) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        // Group chat

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name: name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: {value: string}) => ({
                                id: member.value
                            })),
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            return NextResponse.json(newConversation)
        }

        // for one-to-one conversation, users can only create one with the same user
        // check if there is a conversation between two users
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {     
                        userIds: {
                        equals: [currentUser.id, userId]
                    }},
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        })



        const singleConversation = existingConversations[0]
        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }
        // Otherwise, create a new conversation
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        return NextResponse.json(newConversation)

    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}