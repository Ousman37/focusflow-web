//    src/app/api/auth/sync/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const { firebaseUid, email } = await req.json();

  if (!firebaseUid || !email) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  let user = await db.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        firebaseUid,
        email,
      },
    });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("firebaseUid", firebaseUid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
