// src/app/(app)/sessions/page.tsx
import { getServerSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Clock, Brain } from "lucide-react";
import Link from "next/link";

export default async function SessionsPage() {
  const user = await getServerSessionUser();
  if (!user) redirect("/auth/login");

  const sessions = await db.session.findMany({
    where: { userId: user.id, completed: true },
    orderBy: { startTime: "desc" },
    take: 50,
    select: {
      id: true,
      mode: true,
      startTime: true,
      durationMinutes: true,
      pointsEarned: true,
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {sessions.length} completed sessions
            </p>
          </div>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div className="py-24 text-center text-zinc-500">
            <p className="text-lg">No sessions yet.</p>
            <p className="mt-1 text-sm">Complete your first focus session to see it here.</p>
            <Button asChild className="mt-6">
              <Link href="/focus">Start a Session</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="border-zinc-200 dark:border-zinc-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${
                      session.mode === "HYPERFOCUS"
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                        : "bg-teal-100 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
                    }`}>
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.mode === "HYPERFOCUS" ? "Hyperfocus" : "Scatterfocus"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {format(new Date(session.startTime), "MMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span>{session.durationMinutes ?? 0} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                      <Zap className="h-4 w-4" />
                      <span>+{session.pointsEarned ?? 0} pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
