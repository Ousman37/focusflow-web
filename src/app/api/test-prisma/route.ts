import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await db.user.count();
    return NextResponse.json({
      status: "Prisma 7 connected!",
      userCount,
      message: "Database sync successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
