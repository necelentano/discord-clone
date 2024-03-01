// This currentProfile made to use in the pages directory
import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import prisma from "@/lib/db";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
