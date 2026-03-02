// src/lib/auth.ts

import { cookies } from "next/headers";
import { db } from "./prisma";

export async function getServerSessionUser() {
  const cookieStore = cookies();
  const firebaseUid = (await cookieStore).get("firebaseUid")?.value;

  if (!firebaseUid) return null;

  const user = await db.user.findUnique({
    where: { firebaseUid },
  });

  return user;
}
