import { auth } from "@/auth"; 
import { liveblocks } from "@/liveblocks.server.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth(); 

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = session.user;
  const body = await req.json();
  const room = body.room;

  if (!room) {
    return new NextResponse("Missing room name", { status: 400 });
  }

  const sessionToken = await liveblocks.prepareSession(`room:${room}`, {
    userInfo: {
      name: user.info.name || "Anonymous",
      avatar: user.info.avatar || undefined,
      color: user.info.color || "ffffff"
    },
  });

  return NextResponse.json(await sessionToken);
}
