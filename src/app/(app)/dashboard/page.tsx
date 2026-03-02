// src/app/(app)/dashboard/page.tsx
import { db } from "@/lib/prisma";
import type { Session } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getServerSessionUser } from "@/lib/auth";
import Link from "next/link";
import DailyQuote from "@/components/common/DailyQuote";

export default async function DashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    return (
      <div className="text-muted-foreground p-10 text-center">
        Unauthorized — please sign in
      </div>
    );
  }

  const sessions: Session[] = await db.session.findMany({
    where: { userId: user.id, completed: true },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  const totalPoints = sessions.reduce((sum, s) => sum + s.pointsEarned, 0);

  const sessionsToday = sessions.filter((s) => {
    const today = new Date();
    const d = new Date(s.createdAt);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  const weeklyGoal = 10;
  const weeklyProgress = Math.min(
    100,
    Math.round((sessions.length / weeklyGoal) * 100)
  );

  return (
    <div className="bg-background min-h-screen px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-7xl space-y-12 md:space-y-16">
        {/* HERO + QUOTE */}
        <div className="animate-fade-in bg-card/75 rounded-3xl shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl">
          <div className="p-7 md:p-10">
            <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
              Welcome back, Ethan
            </h1>
            <p className="text-muted-foreground mt-3 text-lg md:text-xl">
              Your focus builds your future.
            </p>
            <DailyQuote /> {/* ← place here, no extra margin */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/focus/hyper">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 active:scale-[0.98]"
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
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Focus Points"
            value={totalPoints.toString()}
            trend="All-time total"
            color="text-teal-600 dark:text-teal-400"
          />
          <StatCard
            title="Sessions Today"
            value={`${sessionsToday}`}
            trend="Daily momentum"
            color="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            title="Weekly Sessions"
            value={`${sessions.length}`}
            trend={`Goal: ${weeklyGoal}`}
            color="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            title="Consistency"
            value={`${weeklyProgress}%`}
            trend="Weekly completion"
            color="text-muted-foreground"
          />
        </div>

        {/* RECENT SESSIONS */}
        <div className="bg-card/70 rounded-3xl shadow-xl backdrop-blur-xl transition-all">
          <div className="p-6 md:p-8">
            <h2 className="text-foreground text-2xl font-semibold">
              Recent Focus Sessions
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Last 7 completed sessions
            </p>

            <div className="mt-6 space-y-4">
              {sessions.length === 0 ? (
                <p className="text-muted-foreground py-10 text-center">
                  No sessions yet — start focusing today!
                </p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-card/50 hover:bg-muted/50 flex items-center justify-between rounded-2xl p-5 transition-colors"
                  >
                    <div>
                      <p className="text-foreground font-medium capitalize">
                        {session.mode.toLowerCase()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {session.durationMinutes ?? 0} min •
                        {new Date(session.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                      +{session.pointsEarned} pts
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-10">
              <div className="text-muted-foreground mb-3 flex justify-between text-sm font-medium">
                <span>Weekly Goal</span>
                <span>{weeklyProgress}%</span>
              </div>
              <Progress
                value={weeklyProgress}
                className={cn(
                  "bg-muted h-3 overflow-hidden rounded-full",
                  "**:[[role=progressbar]]:bg-linear-to-r",
                  "**:[[role=progressbar]]:from-indigo-500",
                  "**:[[role=progressbar]]:to-teal-500"
                )}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center pt-8">
          <Link href="/focus/hyper">
            <Button
              size="lg"
              className={cn(
                "h-14 min-w-60 text-lg font-medium",
                "bg-linear-to-r from-indigo-600 to-indigo-500",
                "text-white",
                "shadow-lg shadow-indigo-500/25",
                "hover:from-indigo-650 hover:to-indigo-550",
                "hover:shadow-xl hover:shadow-indigo-500/35",
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
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-md transition-all hover:shadow-lg">
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <p className="text-foreground mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        {value}
      </p>
      <p className={cn("mt-2 text-sm font-medium", color)}>{trend}</p>
    </div>
  );
}

// // src/app/(app)/dashboard/page.tsx
// import { db } from "@/lib/prisma";
// import type { Session } from "@/generated/prisma";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { cn } from "@/lib/utils";
// import { getServerSessionUser } from "@/lib/auth";
// import Link from "next/link";
// import DailyQuote from "@/components/common/DailyQuote";

// export default async function DashboardPage() {
//   const user = await getServerSessionUser();

//   if (!user) {
//     return (
//       <div className="p-10 text-center text-muted-foreground">
//         Unauthorized — please sign in
//       </div>
//     );
//   }

//   const sessions: Session[] = await db.session.findMany({
//     where: { userId: user.id, completed: true },
//     orderBy: { createdAt: "desc" },
//     take: 7,
//   });

//   const totalPoints = sessions.reduce((sum, s) => sum + s.pointsEarned, 0);

//   const sessionsToday = sessions.filter((s) => {
//     const today = new Date();
//     const d = new Date(s.createdAt);
//     return (
//       d.getDate() === today.getDate() &&
//       d.getMonth() === today.getMonth() &&
//       d.getFullYear() === today.getFullYear()
//     );
//   }).length;

//   const weeklyGoal = 10;
//   const weeklyProgress = Math.min(100, Math.round((sessions.length / weeklyGoal) * 100));

//   return (
//     <div className="min-h-screen bg-background px-5 py-10 md:px-10 md:py-14">
//       <div className="mx-auto max-w-7xl space-y-12 md:space-y-16">
//         {/* HERO + QUOTE */}
//         <div className="animate-fade-in rounded-3xl border border-border bg-card backdrop-blur-xl shadow-xl">
//           <div className="p-7 md:p-10">
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
//               Welcome back, Ethan
//             </h1>

//             <p className="mt-3 text-lg md:text-xl text-muted-foreground">
//               Your focus builds your future.
//             </p>

//             <DailyQuote />

//             <div className="mt-8 flex flex-wrap gap-4">
//               <Link href="/focus/hyper">
//                 <Button
//                   size="lg"
//                   className="bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/95 active:scale-[0.98] transition-all duration-200"
//                 >
//                   Start Hyperfocus Session
//                 </Button>
//               </Link>

//               <Link href="/journal">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-border hover:bg-muted hover:text-foreground transition-colors"
//                 >
//                   Open Scatterfocus Journal
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* STAT CARDS */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard title="Focus Points" value={totalPoints.toString()} trend="All-time total" color="text-teal-600 dark:text-teal-400" />
//           <StatCard title="Sessions Today" value={`${sessionsToday}`} trend="Daily momentum" color="text-indigo-600 dark:text-indigo-400" />
//           <StatCard title="Weekly Sessions" value={`${sessions.length}`} trend={`Goal: ${weeklyGoal}`} color="text-amber-600 dark:text-amber-400" />
//           <StatCard title="Consistency" value={`${weeklyProgress}%`} trend="Weekly completion" color="text-muted-foreground" />
//         </div>

//         {/* RECENT SESSIONS */}
//         <div className="rounded-3xl border border-border bg-card backdrop-blur-xl shadow-xl">
//           <div className="p-6 md:p-8">
//             <h2 className="text-2xl font-semibold text-foreground">
//               Recent Focus Sessions
//             </h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Last 7 completed sessions
//             </p>

//             <div className="mt-6 space-y-4">
//               {sessions.length === 0 ? (
//                 <p className="py-10 text-center text-muted-foreground">
//                   No sessions yet — start focusing today!
//                 </p>
//               ) : (
//                 sessions.map((session) => (
//                   <div
//                     key={session.id}
//                     className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-5 hover:bg-muted/50 transition-colors"
//                   >
//                     <div>
//                       <p className="font-medium capitalize text-foreground">
//                         {session.mode.toLowerCase()}
//                       </p>
//                       <p className="mt-1 text-sm text-muted-foreground">
//                         {session.duration ?? 0} min •{" "}
//                         {new Date(session.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </p>
//                     </div>
//                     <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
//                       +{session.pointsEarned} pts
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Progress */}
//             <div className="mt-10">
//               <div className="mb-3 flex justify-between text-sm font-medium text-muted-foreground">
//                 <span>Weekly Goal</span>
//                 <span>{weeklyProgress}%</span>
//               </div>
//               <Progress
//                 value={weeklyProgress}
//                 className={cn(
//                   "h-3 rounded-full overflow-hidden bg-muted",
//                   "[&_[role=progressbar]]:bg-gradient-to-r",
//                   "[&_[role=progressbar]]:from-indigo-500",
//                   "[&_[role=progressbar]]:via-purple-500",
//                   "[&_[role=progressbar]]:to-teal-500"
//                 )}
//               />
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="flex justify-center pt-8">
//           <Link href="/focus/hyper">
//             <Button
//               size="lg"
//               className="h-14 px-12 text-lg font-semibold bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/95 active:scale-[0.98] transition-all duration-200 sm:px-16"
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
//     <div className="rounded-3xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all">
//       <p className="text-sm font-medium text-muted-foreground">{title}</p>
//       <p className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
//         {value}
//       </p>
//       <p className={cn("mt-2 text-sm font-medium", color)}>{trend}</p>
//     </div>
//   );
// }
