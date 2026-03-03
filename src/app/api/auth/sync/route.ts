//src/app/api/auth/sync/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseUid, email } = body ?? {};

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

    // Create user if not exists
    if (!user) {
      user = await db.user.create({
        data: {
          firebaseUid,
          email,
        },
      });
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // 🔥 Production-safe cookie
    response.cookies.set({
      name: "firebaseUid",
      value: firebaseUid,
      httpOnly: true,
      secure: true,
      sameSite: "none", // <-- critical fix
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

// export async function POST(req: Request) {
//   const { firebaseUid, email } = await req.json();

//   if (!firebaseUid || !email) {
//     return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//   }

//   let user = await db.user.findUnique({
//     where: { firebaseUid },
//   });

//   if (!user) {
//     user = await db.user.create({
//       data: {
//         firebaseUid,
//         email,
//       },
//     });
//   }

//   const response = NextResponse.json({ success: true });

//   response.cookies.set("firebaseUid", firebaseUid, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     path: "/",
//   });

//   return response;
// }
