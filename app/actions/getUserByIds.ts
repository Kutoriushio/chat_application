import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";

export default async function getUserByIds(userIds: string[]) {
  const users = await Promise.all(
    userIds.map(async (userId) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return user as User;
    })
  );

  return users;
}
