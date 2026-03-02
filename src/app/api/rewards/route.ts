//src/app/api/rewards/route.ts
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
    include: {
      sessions: {
        where: { completed: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const totalSessions = user.sessions.length;
  const totalPoints = user.focusPoints;
  const currentStreak = user.streakCurrent;

  const badges = [
    {
      name: "First Session",
      unlocked: totalSessions >= 1,
    },
    {
      name: "5 Sessions",
      unlocked: totalSessions >= 5,
    },
    {
      name: "10 Sessions",
      unlocked: totalSessions >= 10,
    },
    {
      name: "1000 Points",
      unlocked: totalPoints >= 1000,
    },
    {
      name: "7 Day Streak",
      unlocked: currentStreak >= 7,
    },
  ];

  return NextResponse.json({
    totalSessions,
    totalPoints,
    currentStreak,
    badges,
  });
}
