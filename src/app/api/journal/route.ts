// src/app/api/journal/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { content: string; mood?: string; theme?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, mood, theme } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "Valid content is required" },
      { status: 400 }
    );
  }

  try {
    const entry = await db.journalEntry.create({
      data: {
        userId: user.id,
        content: content.trim(),
        mood: mood?.trim() || null,
        theme: theme?.trim() || null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        mood: true,
        theme: true,
      },
    });

    return NextResponse.json({
      id: entry.id,
      content: entry.content,
      createdAt: entry.createdAt.toISOString(),
      mood: entry.mood,
      theme: entry.theme,
    });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}






// src/app/api/journal/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/prisma";
// import { getServerSessionUser } from "@/lib/auth";

// export async function POST(req: Request) {
//   const user = await getServerSessionUser();

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   let body: { content: string; mood?: string; theme?: string };
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
//   }

//   const { content, mood, theme } = body;

//   if (!content || typeof content !== "string" || !content.trim()) {
//     return NextResponse.json(
//       { error: "Valid content is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const entry = await db.journalEntry.create({
//       data: {
//         userId: user.id,
//         content: content.trim(),
//         mood: mood?.trim() || null,
//         theme: theme?.trim() || null,
//       },
//       select: {
//         id: true,
//         content: true,
//         createdAt: true,
//         mood: true,
//         theme: true,
//       },
//     });

//     return NextResponse.json({
//       id: entry.id,
//       content: entry.content,
//       createdAt: entry.createdAt.toISOString(),
//       mood: entry.mood,
//       theme: entry.theme,
//     });
//   } catch (error) {
//     console.error("Error creating journal entry:", error);
//     return NextResponse.json(
//       { error: "Failed to create entry" },
//       { status: 500 }
//     );
//   }
// }
