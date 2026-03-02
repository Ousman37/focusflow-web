import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const firebaseUid = cookieStore.get("firebaseUid")?.value;

  if (!firebaseUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { firebaseUid },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const firebaseUid = cookieStore.get("firebaseUid")?.value;

  if (!firebaseUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const updated = await db.user.update({
    where: { firebaseUid },
    data: {
      name: data.name,
      avatarUrl: data.avatarUrl,
    },
  });

  return NextResponse.json(updated);
}
