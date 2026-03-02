//src/app/api/start/streak/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getServerSessionUser();

    if (!user) {
      return NextResponse.json({ streak: 0 }, { status: 401 });
    }

    const sessions = await db.session.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    if (!sessions.length) {
      return NextResponse.json({ streak: 0 });
    }

    // Normalize today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let lastCheckedDate = today;

    for (const session of sessions) {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);

      const diffInDays =
        (lastCheckedDate.getTime() - sessionDate.getTime()) /
        (1000 * 60 * 60 * 24);

      // Same day session (ignore duplicates)
      if (diffInDays === 0) {
        continue;
      }

      // Exactly previous day
      if (diffInDays === 1) {
        streak++;
        lastCheckedDate = sessionDate;
        continue;
      }

      // Break streak if gap
      break;
    }

    // If user completed session today, count today as part of streak
    const hasTodaySession = sessions.some((session) => {
      const d = new Date(session.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (hasTodaySession) {
      streak++;
    }

    return NextResponse.json({ streak });
  } catch (error) {
    console.error("Streak API error:", error);
    return NextResponse.json({ streak: 0 }, { status: 500 });
  }
}
