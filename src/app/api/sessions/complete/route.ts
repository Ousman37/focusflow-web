// src/app/api/sessions/complete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";
import { startOfDay, differenceInDays } from "date-fns";

export async function POST(req: Request) {
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { sessionId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sessionId } = body;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Valid session ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch session + user streak data in parallel
    const [session, userData] = await Promise.all([
      db.session.findFirst({
        where: {
          id: sessionId,
          userId: user.id,
          completed: false, // prevent double-complete
        },
      }),
      db.user.findUnique({
        where: { id: user.id },
        select: {
          streakCurrent: true,
          streakLongest: true,
          lastSessionDate: true,
        },
      }),
    ]);

    if (!session || !userData) {
      return NextResponse.json(
        { error: "Session or user not found, or session already completed" },
        { status: 404 }
      );
    }

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime.getTime() - session.startTime.getTime()) / 60000
    );

    // Points: customize this logic as needed
    const points = durationMinutes * 10; // 10 pts per minute

    // Streak logic (calendar-aware)
    const today = startOfDay(endTime);
    const lastSessionDay = userData.lastSessionDate
      ? startOfDay(userData.lastSessionDate)
      : null;

    let newStreakCurrent = userData.streakCurrent + 1;

    // Reset streak if gap > 1 day
    if (lastSessionDay && differenceInDays(today, lastSessionDay) > 1) {
      newStreakCurrent = 1;
    }

    const newStreakLongest = Math.max(userData.streakLongest, newStreakCurrent);

    // Atomic transaction
    await db.$transaction([
      // Update session
      db.session.update({
        where: { id: sessionId },
        data: {
          endTime,
          durationMinutes, // ← fixed field name (was 'duration' in old code)
          completed: true,
          pointsEarned: points,
        },
      }),

      // Update user
      db.user.update({
        where: { id: user.id },
        data: {
          focusPoints: { increment: points },
          lastSessionDate: endTime,
          streakCurrent: newStreakCurrent,
          streakLongest: newStreakLongest,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      points,
      durationMinutes,
      endTime: endTime.toISOString(),
      streakCurrent: newStreakCurrent,
      streakLongest: newStreakLongest,
    });
  } catch (error) {
    console.error("Error completing session:", error);
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}
