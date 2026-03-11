//src/app/api/auth/sync/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseUid, email, name, avatarUrl } = body ?? {};

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: "Missing firebaseUid or email" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await db.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      // Guard against email collision (same email, different auth method)
      const existingByEmail = await db.user.findUnique({ where: { email } });
      if (existingByEmail) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Try logging in with your original method.",
          },
          { status: 409 }
        );
      }

      user = await db.user.create({
        data: {
          firebaseUid,
          email,
          name: name ?? null,
          avatarUrl: avatarUrl ?? null,
        },
      });
    } else if (avatarUrl && user.avatarUrl !== avatarUrl) {
      // Keep Google avatar in sync if it changes
      user = await db.user.update({
        where: { firebaseUid },
        data: { avatarUrl },
      });
    }

    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set({
      name: "firebaseUid",
      value: firebaseUid,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("AUTH SYNC ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error during sync" },
      { status: 500 }
    );
  }
}
