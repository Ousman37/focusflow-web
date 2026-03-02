// src/app/api/sessions/start/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getServerSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized - please log in" }, { status: 401 });
    }

    let body: { mode: "hyper" | "scatter" };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { mode } = body;

    if (!mode || !["hyper", "scatter"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid or missing mode (must be 'hyper' or 'scatter')" },
        { status: 400 }
      );
    }

    // Map frontend lowercase → Prisma enum uppercase
    const dbMode = mode === "hyper" ? "HYPERFOCUS" : "SCATTERFOCUS";

    const session = await db.session.create({
      data: {
        userId: user.id,
        mode: dbMode,
        startTime: new Date(),
        completed: false,
        pointsEarned: 0,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("[API /sessions/start] Error:", error);

    // Better Prisma error messages
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Unique constraint violation" }, { status: 409 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to start session" },
      { status: 500 }
    );
  }
}
