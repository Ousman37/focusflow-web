import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ MUST await
    const sessionCookie = cookieStore.get("session"); // or your cookie name

    if (!sessionCookie) {
      return NextResponse.json({ activeSession: null }, { status: 200 });
    }

    // Replace with your real user lookup logic
    const userId = sessionCookie.value;

    const activeSession = await db.session.findFirst({
      where: {
        userId,
        completed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (activeSession) {
      return NextResponse.json({
        activeSession: {
          id: activeSession.id,
          startTime: activeSession.startTime,
        },
      });
    }

    // Last completed session
    const lastSession = await db.session.findFirst({
      where: {
        userId,
        completed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let lastSessionAgo: string | null = null;

    if (lastSession) {
      const diffMs = Date.now() - new Date(lastSession.createdAt).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        lastSessionAgo = `${diffMinutes}m ago`;
      } else {
        lastSessionAgo = `${diffHours}h ago`;
      }
    }

    return NextResponse.json({
      activeSession: null,
      lastSessionAgo,
    });
  } catch (error) {
    console.error("Status route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session status" },
      { status: 500 }
    );
  }
}
