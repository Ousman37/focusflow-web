// src/app/api/rituals/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";
import { startOfDay } from "date-fns";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const ritual = await db.ritual.findFirst({ where: { id, userId: user.id } });
  if (!ritual) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const today = startOfDay(new Date());
  const lastCompleted = ritual.lastCompleted ? startOfDay(ritual.lastCompleted) : null;
  const completedToday = !ritual.completedToday;

  let newStreak = ritual.streak;
  if (completedToday) {
    // Only increment streak if not already completed today
    const isNewDay = !lastCompleted || lastCompleted < today;
    newStreak = isNewDay ? ritual.streak + 1 : ritual.streak;
  } else {
    newStreak = Math.max(0, ritual.streak - 1);
  }

  const updated = await db.ritual.update({
    where: { id },
    data: {
      completedToday,
      streak: newStreak,
      lastCompleted: completedToday ? new Date() : ritual.lastCompleted,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const ritual = await db.ritual.findFirst({ where: { id, userId: user.id } });
  if (!ritual) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.ritual.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
