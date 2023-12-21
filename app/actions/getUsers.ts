import getSession from "./getSession";
import prisma from "@/app/libs/prismadb"

export default async function getUsers() {
    const session = await getSession();

    if(!session) {
        return [];
    }

    try {
        const users = prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                NOT: {
                    email: session.user?.email
                }
            }
        })

        return users

    } catch (error) {
        return []
    }
}