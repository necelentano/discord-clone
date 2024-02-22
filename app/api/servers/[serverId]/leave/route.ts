import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import prisma from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // Admin cannot leave server - check if person who leave the server is not a person who created this server
        },
        members: {
          some: {
            profileId: profile.id, // confirm that the person who want to leave the server  is part of the members
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // delete member with the profile.id
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
