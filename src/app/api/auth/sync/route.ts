// src/app/api/auth/sync/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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

    // Ensure DB connection works
    let user = await db.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          firebaseUid,
          email,
        },
      });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("firebaseUid", firebaseUid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
