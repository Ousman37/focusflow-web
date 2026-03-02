import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getServerSessionUser();

    if (!user) {
      return NextResponse.json({ progress: 0 });
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const sessionsThisWeek = await db.session.count({
      where: {
        userId: user.id,
        completed: true,
        createdAt: {
          gte: startOfWeek,
        },
      },
    });

    const weeklyGoal = 10;

    const progress = Math.min(
      100,
      Math.round((sessionsThisWeek / weeklyGoal) * 100)
    );

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Weekly progress error:", error);
    return NextResponse.json({ progress: 0 });
  }
}
