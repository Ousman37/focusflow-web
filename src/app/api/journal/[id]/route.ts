// src/app/api/journal/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getServerSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Entry ID is required" },
      { status: 400 }
    );
  }

  let body: { content?: string; mood?: string; theme?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, mood, theme } = body;

  if (content !== undefined && (!content || typeof content !== "string" || !content.trim())) {
    return NextResponse.json(
      { error: "Valid content is required if provided" },
      { status: 400 }
    );
  }

  try {
    // Security: verify ownership
    const existing = await db.journalEntry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Entry not found or not owned by you" },
        { status: 404 }
      );
    }

    const updated = await db.journalEntry.update({
      where: { id },
      data: {
        content: content !== undefined ? content.trim() : undefined,
        mood: mood !== undefined ? (mood.trim() || null) : undefined,
        theme: theme !== undefined ? (theme.trim() || null) : undefined,
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
      id: updated.id,
      content: updated.content,
      createdAt: updated.createdAt.toISOString(),
      mood: updated.mood,
      theme: updated.theme,
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
