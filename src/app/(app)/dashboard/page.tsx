// src/app/(app)/dashboard/page.tsx
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getServerSessionUser } from "@/lib/auth";
import Link from "next/link";
import DailyQuote from "@/components/common/DailyQuote";
import { Flame, AlertCircle } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { JSX } from "react";

// Explicit type for the selected session fields
type RecentSession = Prisma.SessionGetPayload<{
  select: {
    id: true;
    mode: true;
    durationMinutes: true;
    pointsEarned: true;
    createdAt: true;
  };
}>;

export default async function DashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg">Please sign in to view your dashboard</p>
        </div>
      </div>
    );
  }

  let recentSessions: RecentSession[] = [];
  let totalPoints = 0;
  let sessionsToday = 0;
  let currentStreak = 0;
  let error: string | null = null;

  try {
    recentSessions = await db.session.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      orderBy: { createdAt: "desc" },
      take: 7,
      select: {
        id: true,
        mode: true,
        durationMinutes: true,
        pointsEarned: true,
        createdAt: true,
      },
    });

    totalPoints = recentSessions.reduce((sum, s) => sum + (s.pointsEarned ?? 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    sessionsToday = recentSessions.filter((s) => {
      const sessionDate = new Date(s.createdAt);
      return sessionDate >= today;
    }).length;

    if (recentSessions.length > 0) {
      let streak = 1;
      let prevDate = new Date(recentSessions[0].createdAt);
      prevDate.setHours(0, 0, 0, 0);

      for (let i = 1; i < recentSessions.length; i++) {
        const currDate = new Date(recentSessions[i].createdAt);
        currDate.setHours(0, 0, 0, 0);

        const diffDays = Math.round(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          break;
        }

        prevDate = currDate;
      }

      currentStreak = streak;
    }
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
    error = "Failed to load some dashboard data. Try refreshing.";
  }

  const weeklyGoal = 10;
  const weeklySessions = recentSessions.length;
  const weeklyProgress = Math.min(
    100,
    Math.round((weeklySessions / weeklyGoal) * 100)
  );

  const getGoalEmoji = (percent: number) => {
    if (percent >= 100) return "🔥";
    if (percent >= 75) return "😎";
    if (percent >= 50) return "🙂";
    if (percent >= 25) return "😐";
    return "😴";
  };

  return (
    <div className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-7xl space-y-12 md:space-y-16">
        {/* Hero Welcome + Quote */}
        <div className="animate-fade-in rounded-3xl bg-card/75 p-7 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl md:p-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Welcome back, {user.name?.split(" ")[0] || "Focus Master"}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground md:text-xl">
            Your focus builds your future.
          </p>

          <div className="mt-6">
            <DailyQuote />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/focus/hyper">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                Start Hyperfocus Session
              </Button>
            </Link>

            <Link href="/journal">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-500/70 text-teal-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50/70 hover:text-teal-700 dark:border-teal-400/60 dark:text-teal-300 dark:hover:bg-teal-950/30 dark:hover:text-teal-200"
              >
                Open Scatterfocus Journal
              </Button>
            </Link>
          </div>
        </div>

        {/* Error fallback */}
        {error && (
          <div className="rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
            <AlertCircle className="mx-auto h-8 w-8" />
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Focus Points"
            value={totalPoints.toLocaleString()}
            trend="All-time total"
            color="text-teal-600 dark:text-teal-400"
          />
          <StatCard
            title="Sessions Today"
            value={sessionsToday.toString()}
            trend="Daily momentum"
            color="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            title="Current Streak"
            value={
              currentStreak > 0 ? (
                <span className="flex items-center gap-2">
                  {currentStreak}
                  <Flame className="h-6 w-6 text-amber-500" />
                </span>
              ) : (
                "0"
              )
            }
            trend={currentStreak > 0 ? "days strong" : "Start your streak!"}
            color="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            title="Weekly Sessions"
            value={`${weeklySessions}`}
            trend={`Goal: ${weeklyGoal}`}
            color="text-purple-600 dark:text-purple-400"
          />
        </div>

        {/* Weekly Goal Ring */}
        <div className="rounded-3xl bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-foreground">
            Weekly Goal Progress
          </h2>

          <p className="mt-2 text-muted-foreground">
            {weeklySessions} / {weeklyGoal} sessions completed
          </p>

          <div className="mx-auto mt-8 w-48">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                {getGoalEmoji(weeklyProgress)}
              </div>
              <Progress value={weeklyProgress} className="h-4 rounded-full" />
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="rounded-3xl bg-card/70 p-6 shadow-xl backdrop-blur-xl transition-all md:p-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Recent Focus Sessions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Last 7 completed sessions
          </p>

          <div className="mt-6 space-y-4">
            {recentSessions.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground">
                No sessions yet — start focusing today!
              </p>
            ) : (
              recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-2xl bg-card/50 p-5 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium capitalize text-foreground">
                      {session.mode.toLowerCase()}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {session.durationMinutes ?? 0} min •{" "}
                      {new Date(session.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                    +{session.pointsEarned ?? 0} pts
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex justify-center pt-8">
          <Link href="/focus/hyper">
            <Button
              size="lg"
              className={cn(
                "h-14 min-w-60 text-lg font-medium",
                "bg-linear-to-r from-indigo-600 to-indigo-500",
                "text-white shadow-lg shadow-indigo-500/25",
                "hover:from-indigo-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/35",
                "active:scale-[0.98]",
                "transition-all duration-250 ease-out",
                "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              )}
            >
              Begin Deep Work Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  color,
}: {
  title: string;
  value: string | JSX.Element;
  trend: string;
  color: string;
}) {
  return (
    <div className="rounded-3xl bg-card/70 p-6 shadow-md transition-all hover:shadow-lg backdrop-blur-xl">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className={cn("mt-3 text-3xl font-bold md:text-4xl", color)}>
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        {trend}
      </p>
    </div>
  );
}

function getGoalEmoji(percent: number) {
  if (percent >= 100) return "🔥";
  if (percent >= 75) return "😎";
  if (percent >= 50) return "🙂";
  if (percent >= 25) return "😐";
  return "😴";
}



// src/app/(app)/dashboard/page.tsx
// import { db } from "@/lib/prisma";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { cn } from "@/lib/utils";
// import { getServerSessionUser } from "@/lib/auth";
// import Link from "next/link";
// import DailyQuote from "@/components/common/DailyQuote";
// import { Flame, AlertCircle } from "lucide-react";
// import { JSX } from "react/jsx-runtime";

// export default async function DashboardPage() {
//   const user = await getServerSessionUser();

//   if (!user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="text-center text-muted-foreground">
//           <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
//           <p className="mt-4 text-lg">Please sign in to view your dashboard</p>
//         </div>
//       </div>
//     );
//   }

//   let recentSessions: {
//     id: string;
//     createdAt: Date;
//     mode: string;
//     durationMinutes: number | null;
//     pointsEarned: number;
//   }[] = [];
//   let totalPoints = 0;
//   let sessionsToday = 0;
//   let currentStreak = 0;
//   let error = null;

//   try {
//     recentSessions = await db.session.findMany({
//       where: {
//         userId: user.id,
//         completed: true,
//       },
//       orderBy: { createdAt: "desc" },
//       take: 7,
//       select: {
//         id: true,
//         mode: true,
//         durationMinutes: true,
//         pointsEarned: true,
//         createdAt: true,
//       },
//     });

//     totalPoints = recentSessions.reduce((sum, s) => sum + (s.pointsEarned ?? 0), 0);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     sessionsToday = recentSessions.filter((s) => {
//       const sessionDate = new Date(s.createdAt);
//       return sessionDate >= today;
//     }).length;

//     // Calculate current streak (consecutive days with sessions)
//     if (recentSessions.length > 0) {
//       let streak = 1;
//       let prevDate = new Date(recentSessions[0].createdAt);
//       prevDate.setHours(0, 0, 0, 0);

//       for (let i = 1; i < recentSessions.length; i++) {
//         const currDate = new Date(recentSessions[i].createdAt);
//         currDate.setHours(0, 0, 0, 0);

//         const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

//         if (diffDays === 1) {
//           streak++;
//         } else if (diffDays > 1) {
//           break;
//         }

//         prevDate = currDate;
//       }

//       currentStreak = streak;
//     }
//   } catch (err) {
//     console.error("Dashboard data fetch error:", err);
//     error = "Failed to load some dashboard data. Try refreshing.";
//   }

//   const weeklyGoal = 10;
//   const weeklySessions = recentSessions.length;
//   const weeklyProgress = Math.min(100, Math.round((weeklySessions / weeklyGoal) * 100));

//   // Emoji progression for goal ring
//   const getGoalEmoji = (percent: number) => {
//     if (percent >= 100) return "🔥";
//     if (percent >= 75) return "😎";
//     if (percent >= 50) return "🙂";
//     if (percent >= 25) return "😐";
//     return "😴";
//   };

//   return (
//     <div className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14">
//       <div className="mx-auto max-w-7xl space-y-12 md:space-y-16">
//         {/* Hero Welcome + Quote */}
//         <div className="animate-fade-in rounded-3xl bg-card/75 p-7 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl md:p-10">
//           <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
//             Welcome back, {user.name?.split(" ")[0] || "Focus Master"}
//           </h1>
//           <p className="mt-3 text-lg text-muted-foreground md:text-xl">
//             Your focus builds your future.
//           </p>

//           <div className="mt-6">
//             <DailyQuote />
//           </div>

//           <div className="mt-8 flex flex-wrap gap-4">
//             <Link href="/focus/hyper">
//               <Button
//                 size="lg"
//                 className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
//               >
//                 Start Hyperfocus Session
//               </Button>
//             </Link>

//             <Link href="/journal">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-teal-500/70 text-teal-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50/70 hover:text-teal-700 dark:border-teal-400/60 dark:text-teal-300 dark:hover:bg-teal-950/30 dark:hover:text-teal-200"
//               >
//                 Open Scatterfocus Journal
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Error fallback */}
//         {error && (
//           <div className="rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
//             <AlertCircle className="mx-auto h-8 w-8" />
//             <p className="mt-2">{error}</p>
//           </div>
//         )}

//         {/* Stat Cards */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard
//             title="Focus Points"
//             value={totalPoints.toLocaleString()}
//             trend="All-time total"
//             color="text-teal-600 dark:text-teal-400"
//           />
//           <StatCard
//             title="Sessions Today"
//             value={sessionsToday.toString()}
//             trend="Daily momentum"
//             color="text-indigo-600 dark:text-indigo-400"
//           />
//           <StatCard
//             title="Current Streak"
//             value={
//               currentStreak > 0 ? (
//                 <span className="flex items-center gap-2">
//                   {currentStreak}
//                   <Flame className="h-6 w-6 text-amber-500 animate-pulse" />
//                 </span>
//               ) : (
//                 "0"
//               )
//             }
//             trend={currentStreak > 0 ? "days strong" : "Start your streak!"}
//             color="text-amber-600 dark:text-amber-400"
//           />
//           <StatCard
//             title="Weekly Sessions"
//             value={`${weeklySessions}`}
//             trend={`Goal: ${weeklyGoal}`}
//             color="text-purple-600 dark:text-purple-400"
//           />
//         </div>

//         {/* Weekly Goal Ring */}
//         <div className="rounded-3xl bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl">
//           <h2 className="text-2xl font-semibold text-foreground">Weekly Goal Progress</h2>
//           <p className="mt-2 text-muted-foreground">
//             {weeklySessions} / {weeklyGoal} sessions completed
//           </p>

//           <div className="mx-auto mt-8 w-48">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center justify-center text-8xl">
//                 {getGoalEmoji(weeklyProgress)}
//               </div>
//               <Progress value={weeklyProgress} className="h-4 rounded-full" />
//             </div>
//           </div>
//         </div>

//         {/* Recent Sessions */}
//         <div className="rounded-3xl bg-card/70 p-6 shadow-xl backdrop-blur-xl transition-all md:p-8">
//           <h2 className="text-2xl font-semibold text-foreground">
//             Recent Focus Sessions
//           </h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Last 7 completed sessions
//           </p>

//           <div className="mt-6 space-y-4">
//             {recentSessions.length === 0 ? (
//               <p className="py-10 text-center text-muted-foreground">
//                 No sessions yet — start focusing today!
//               </p>
//             ) : (
//               recentSessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="flex items-center justify-between rounded-2xl bg-card/50 p-5 transition-colors hover:bg-muted/50"
//                 >
//                   <div>
//                     <p className="font-medium capitalize text-foreground">
//                       {session.mode.toLowerCase()}
//                     </p>
//                     <p className="mt-1 text-sm text-muted-foreground">
//                       {session.durationMinutes ?? 0} min •{" "}
//                       {new Date(session.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>
//                   <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
//                     +{session.pointsEarned ?? 0} pts
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Final CTA */}
//         <div className="flex justify-center pt-8">
//           <Link href="/focus/hyper">
//             <Button
//               size="lg"
//               className={cn(
//                 "h-14 min-w-60 text-lg font-medium",
//                 "bg-linear-to-r from-indigo-600 to-indigo-500",
//                 "text-white shadow-lg shadow-indigo-500/25",
//                 "hover:from-indigo-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/35",
//                 "active:scale-[0.98]",
//                 "transition-all duration-250 ease-out",
//                 "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
//               )}
//             >
//               Begin Deep Work Now
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   trend,
//   color,
// }: {
//   title: string;
//   value: string | JSX.Element;
//   trend: string;
//   color: string;
// }) {
//   return (
//     <div className="rounded-3xl bg-card/70 p-6 shadow-md transition-all hover:shadow-lg backdrop-blur-xl">
//       <p className="text-sm font-medium text-muted-foreground">{title}</p>
//       <p className={cn("mt-3 text-3xl font-bold tracking-tight md:text-4xl", color)}>
//         {value}
//       </p>
//       <p className="mt-2 text-sm font-medium text-muted-foreground">{trend}</p>
//     </div>
//   );
// }

// function getGoalEmoji(percent: number) {
//   if (percent >= 100) return "🔥";
//   if (percent >= 75) return "😎";
//   if (percent >= 50) return "🙂";
//   if (percent >= 25) return "😐";
//   return "😴";
// }

// // src/app/(app)/dashboard/page.tsx
// import { db } from "@/lib/prisma";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { cn } from "@/lib/utils";
// import { getServerSessionUser } from "@/lib/auth";
// import Link from "next/link";
// import DailyQuote from "@/components/common/DailyQuote";
// import { Flame, AlertCircle } from "lucide-react";
// import { $Enums } from "@/generated/prisma";

// export default async function DashboardPage() {
//   const user = await getServerSessionUser();

//   if (!user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="text-center text-muted-foreground">
//           <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
//           <p className="mt-4 text-lg">Please sign in to view your dashboard</p>
//         </div>
//       </div>
//     );
//   }

//   let recentSessions: { id: string; createdAt: Date; mode: $Enums.FocusMode; durationMinutes: number | null; pointsEarned: number; }[] = [];
//   let totalPoints = 0;
//   let sessionsToday = 0;
//   let error = null;

//   try {
//     // Safe query – only fetch what we need
//     recentSessions = await db.session.findMany({
//       where: {
//         userId: user.id,
//         completed: true,
//       },
//       orderBy: { createdAt: "desc" },
//       take: 7,
//       select: {
//         id: true,
//         mode: true,
//         durationMinutes: true,
//         pointsEarned: true,
//         createdAt: true,
//       },
//     });

//     totalPoints = recentSessions.reduce((sum, s) => sum + (s.pointsEarned ?? 0), 0);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     sessionsToday = recentSessions.filter((s) => {
//       const sessionDate = new Date(s.createdAt);
//       return sessionDate >= today;
//     }).length;
//   } catch (err) {
//     console.error("Dashboard data fetch error:", err);
//     error = "Failed to load recent sessions. Showing limited data.";
//   }

//   const weeklyGoal = 10;
//   const weeklySessions = recentSessions.length;
//   const weeklyProgress = Math.min(100, Math.round((weeklySessions / weeklyGoal) * 100));

//   // Emoji progression for goal ring
//   const getGoalEmoji = (percent: number) => {
//     if (percent >= 100) return "🔥";
//     if (percent >= 75) return "😎";
//     if (percent >= 50) return "🙂";
//     if (percent >= 25) return "😐";
//     return "😴";
//   };

//   return (
//     <div className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14">
//       <div className="mx-auto max-w-7xl space-y-12 md:space-y-16">
//         {/* Hero Welcome + Quote */}
//         <div className="animate-fade-in rounded-3xl bg-card/75 p-7 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl md:p-10">
//           <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
//             Welcome back, {user.name?.split(" ")[0] || "Focus Master"}
//           </h1>
//           <p className="mt-3 text-lg text-muted-foreground md:text-xl">
//             Your focus builds your future.
//           </p>

//           <div className="mt-6">
//             <DailyQuote />
//           </div>

//           <div className="mt-8 flex flex-wrap gap-4">
//             <Link href="/focus/hyper">
//               <Button
//                 size="lg"
//                 className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
//               >
//                 Start Hyperfocus Session
//               </Button>
//             </Link>

//             <Link href="/journal">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-teal-500/70 text-teal-600 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50/70 hover:text-teal-700 dark:border-teal-400/60 dark:text-teal-300 dark:hover:bg-teal-950/30 dark:hover:text-teal-200"
//               >
//                 Open Scatterfocus Journal
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Error fallback if data fetch failed */}
//         {error && (
//           <div className="rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
//             <AlertCircle className="mx-auto h-8 w-8" />
//             <p className="mt-2">{error}</p>
//           </div>
//         )}

//         {/* Stat Cards */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard
//             title="Focus Points"
//             value={totalPoints.toLocaleString()}
//             trend="All-time total"
//             color="text-teal-600 dark:text-teal-400"
//           />
//           <StatCard
//             title="Sessions Today"
//             value={sessionsToday.toString()}
//             trend="Daily momentum"
//             color="text-indigo-600 dark:text-indigo-400"
//           />
//           <StatCard
//             title="Weekly Sessions"
//             value={weeklySessions.toString()}
//             trend={`Goal: ${weeklyGoal}`}
//             color="text-amber-600 dark:text-amber-400"
//           />
//           <StatCard
//             title="Consistency"
//             value={`${weeklyProgress}%`}
//             trend="Weekly completion"
//             color="text-muted-foreground"
//           />
//         </div>

//         {/* Weekly Goal Ring */}
//         <div className="rounded-3xl bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl">
//           <h2 className="text-2xl font-semibold text-foreground">Weekly Goal Progress</h2>
//           <p className="mt-2 text-muted-foreground">
//             {weeklySessions} / {weeklyGoal} sessions completed
//           </p>

//           <div className="mx-auto mt-8 w-48">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center justify-center text-8xl">
//                 {getGoalEmoji(weeklyProgress)}
//               </div>
//               <Progress value={weeklyProgress} className="h-4 rounded-full" />
//             </div>
//           </div>
//         </div>

//         {/* Recent Sessions */}
//         <div className="rounded-3xl bg-card/70 p-6 shadow-xl backdrop-blur-xl transition-all md:p-8">
//           <h2 className="text-2xl font-semibold text-foreground">
//             Recent Focus Sessions
//           </h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Last 7 completed sessions
//           </p>

//           <div className="mt-6 space-y-4">
//             {recentSessions.length === 0 ? (
//               <p className="py-10 text-center text-muted-foreground">
//                 No sessions yet — start focusing today!
//               </p>
//             ) : (
//               recentSessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="flex items-center justify-between rounded-2xl bg-card/50 p-5 transition-colors hover:bg-muted/50"
//                 >
//                   <div>
//                     <p className="font-medium capitalize text-foreground">
//                       {session.mode.toLowerCase()}
//                     </p>
//                     <p className="mt-1 text-sm text-muted-foreground">
//                       {session.durationMinutes ?? 0} min •{" "}
//                       {new Date(session.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>
//                   <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
//                     +{session.pointsEarned ?? 0} pts
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Final CTA */}
//         <div className="flex justify-center pt-8">
//           <Link href="/focus/hyper">
//             <Button
//               size="lg"
//               className={cn(
//                 "h-14 min-w-60 text-lg font-medium",
//                 "bg-linear-to-r from-indigo-600 to-indigo-500",
//                 "text-white shadow-lg shadow-indigo-500/25",
//                 "hover:from-indigo-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/35",
//                 "active:scale-[0.98]",
//                 "transition-all duration-250 ease-out",
//                 "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
//               )}
//             >
//               Begin Deep Work Now
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   trend,
//   color,
// }: {
//   title: string;
//   value: string;
//   trend: string;
//   color: string;
// }) {
//   return (
//     <div className="rounded-3xl bg-card/70 p-6 shadow-md transition-all hover:shadow-lg backdrop-blur-xl">
//       <p className="text-sm font-medium text-muted-foreground">{title}</p>
//       <p className={cn("mt-3 text-3xl font-bold tracking-tight md:text-4xl", color)}>
//         {value}
//       </p>
//       <p className="mt-2 text-sm font-medium text-muted-foreground">{trend}</p>
//     </div>
//   );
// }

// function getGoalEmoji(percent: number) {
//   if (percent >= 100) return "🔥";
//   if (percent >= 75) return "😎";
//   if (percent >= 50) return "🙂";
//   if (percent >= 25) return "😐";
//   return "😴";
// }

