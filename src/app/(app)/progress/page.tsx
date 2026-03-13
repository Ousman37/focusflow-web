// src/app/(app)/progress/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Flame, Zap, CalendarDays, Trophy } from "lucide-react";
import Link from "next/link";
import { getServerSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { startOfWeek, endOfWeek, startOfMonth, subDays, format } from "date-fns";
import FocusBarChart from "@/components/progress/FocusBarChart";

export default async function ProgressPage() {
  const user = await getServerSessionUser();
  if (!user) redirect("/auth/login");

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const [weeklySessions, monthlySessions, last7DaysSessions, bestSession] = await Promise.all([
    db.session.findMany({
      where: { userId: user.id, completed: true, startTime: { gte: weekStart, lte: weekEnd } },
      select: { pointsEarned: true },
    }),
    db.session.findMany({
      where: { userId: user.id, completed: true, startTime: { gte: monthStart } },
      select: { pointsEarned: true, durationMinutes: true },
    }),
    db.session.findMany({
      where: { userId: user.id, completed: true, startTime: { gte: subDays(now, 6) } },
      select: { startTime: true, durationMinutes: true },
    }),
    db.session.findFirst({
      where: { userId: user.id, completed: true },
      orderBy: { durationMinutes: "desc" },
      select: { durationMinutes: true, mode: true },
    }),
  ]);

  const weeklySessionCount = weeklySessions.length;
  const weeklyPoints = weeklySessions.reduce((sum, s) => sum + (s.pointsEarned ?? 0), 0);
  const weeklyGoal = 10;
  const weeklyPercent = Math.min(100, Math.round((weeklySessionCount / weeklyGoal) * 100));

  const monthlySessionCount = monthlySessions.length;
  const monthlyPoints = monthlySessions.reduce((sum, s) => sum + (s.pointsEarned ?? 0), 0);

  const bestSessionLabel = bestSession
    ? `${bestSession.durationMinutes} min ${bestSession.mode === "HYPERFOCUS" ? "Hyperfocus" : "Scatterfocus"}`
    : "No sessions yet";

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(now, 6 - i);
    const dayLabel = format(day, "EEE");
    const dayStr = format(day, "yyyy-MM-dd");
    const minutes = last7DaysSessions
      .filter((s) => format(s.startTime, "yyyy-MM-dd") === dayStr)
      .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
    return { day: dayLabel, minutes };
  });

  const getGoalEmoji = (percent: number) => {
    if (percent >= 100) return "🔥";
    if (percent >= 75) return "😎";
    if (percent >= 50) return "🙂";
    if (percent >= 25) return "😐";
    return "😴";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-950/95 to-zinc-900 px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="gap-2 border-zinc-700 hover:bg-zinc-800">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Progress & Insights
            </h1>
            <p className="mt-1 text-zinc-400">See how far you've come. Celebrate your focus journey.</p>
          </div>
        </div>

        {/* Weekly Goal Ring */}
        <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-zinc-100">Weekly Goal Progress</CardTitle>
            <CardDescription className="text-zinc-400">
              {weeklySessionCount} / {weeklyGoal} sessions this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-8 border-zinc-800" />
              <div
                className="absolute inset-0 rounded-full border-8 border-indigo-600 transition-all duration-1000"
                style={{ clipPath: `inset(${100 - weeklyPercent}% 0 0 0)` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-indigo-400">{weeklyPercent}%</span>
                <span className="mt-2 text-4xl">{getGoalEmoji(weeklyPercent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly stat cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <CalendarDays className="h-4 w-4" /> Sessions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-400">{weeklySessionCount}</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Zap className="h-4 w-4" /> Focus Points (Week)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-400">{weeklyPoints.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Flame className="h-4 w-4" /> Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="text-4xl font-bold text-amber-400">{user.streakCurrent}</div>
              <span className="text-zinc-500">days</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Trophy className="h-4 w-4" /> Best Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium text-zinc-200">{bestSessionLabel}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart */}
        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-zinc-100">Focus Minutes — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <FocusBarChart data={chartData} />
          </CardContent>
        </Card>

        {/* Monthly stats */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-100">This Month</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-400">{monthlySessionCount}</div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Points Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-400">{monthlyPoints.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Longest Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">{user.streakLongest} days</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
