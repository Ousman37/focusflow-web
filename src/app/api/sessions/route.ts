// src/app/api/sessions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getServerSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  const [sessions, total] = await Promise.all([
    db.session.findMany({
      where: { userId: user.id, completed: true },
      orderBy: { startTime: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        mode: true,
        startTime: true,
        durationMinutes: true,
        pointsEarned: true,
      },
    }),
    db.session.count({ where: { userId: user.id, completed: true } }),
  ]);

  return NextResponse.json({ sessions, total, page, pages: Math.ceil(total / limit) });
}
