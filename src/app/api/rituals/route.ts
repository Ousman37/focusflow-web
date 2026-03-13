// src/app/api/rituals/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getServerSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rituals = await db.ritual.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(rituals);
}

export async function POST(req: Request) {
  const user = await getServerSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name: string; description?: string; frequency: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description, frequency } = body;
  if (!name?.trim() || !frequency?.trim()) {
    return NextResponse.json({ error: "Name and frequency are required" }, { status: 400 });
  }

  const ritual = await db.ritual.create({
    data: { userId: user.id, name: name.trim(), description: description?.trim(), frequency },
  });

  return NextResponse.json(ritual, { status: 201 });
}
