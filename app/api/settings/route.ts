import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {name, image} = body;

        if(!currentUser?.id) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name,
                image: image
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}