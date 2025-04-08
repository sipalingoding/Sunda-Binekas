import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "../auth/session/route";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    console.log("session", session);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
