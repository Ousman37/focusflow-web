// src/lib/auth.ts

import { cache } from "react";
import { cookies } from "next/headers";
import { db } from "./prisma";

// cache() deduplicates DB calls within a single request render tree
export const getServerSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const firebaseUid = cookieStore.get("firebaseUid")?.value;

  if (!firebaseUid) return null;

  return db.user.findUnique({ where: { firebaseUid } });
});
