// src/app/(app)/progress/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  // Dummy stats (replace with Prisma aggregates later)
  const weekly = {
    sessions: 12,
    points: 1450,
    streak: 8,
    best: "52 min Hyperfocus",
    goal: 20,
    completedPercent: 60,
  };

  const monthly = {
    sessions: 45,
    points: 6200,
    longestStreak: 14,
    mostProductiveDay: "Wednesday",
  };

  // Simple progress ring emoji logic
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
        {/* Header – Back button + title/subtitle */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 border-zinc-700 transition-colors hover:bg-zinc-800"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
                Progress & Insights
              </h1>
              <p className="mt-2 text-lg text-zinc-400">
                See how far you've come. Celebrate your focus journey.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Goal Ring */}
        <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Weekly Goal Progress</CardTitle>
            <CardDescription className="text-zinc-400">
              Sessions completed this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="relative h-48 w-48">
              {/* Ring */}
              <div className="absolute inset-0 rounded-full border-8 border-zinc-800" />
              <div
                className="absolute inset-0 rounded-full border-8 border-indigo-600 transition-all duration-1000"
                style={{
                  clipPath: `inset(${100 - weekly.completedPercent}% 0 0 0)`,
                }}
              />
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-indigo-400">
                  {weekly.completedPercent}%
                </span>
                <span className="mt-2 text-5xl">
                  {getGoalEmoji(weekly.completedPercent)}
                </span>
              </div>
            </div>
            <p className="mt-6 text-lg text-zinc-300">
              {weekly.sessions} / {weekly.goal} sessions
            </p>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sessions This Week */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition-transform hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Sessions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-400">
                {weekly.sessions}
              </div>
            </CardContent>
          </Card>

          {/* Focus Points */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition-transform hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Focus Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-400">
                {weekly.points.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition-transform hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="text-4xl font-bold text-amber-400">
                {weekly.streak}
              </div>
              <Flame className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          {/* Best Session */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition-transform hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Best Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium text-zinc-200">
                {weekly.best}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Line Chart Placeholder */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Focused Hours – Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-center justify-center rounded-xl bg-zinc-950/50 text-zinc-500">
                [Line chart – add Recharts here]
              </div>
            </CardContent>
          </Card>

          {/* Mood Breakdown Placeholder */}
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Mood Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-center justify-center rounded-xl bg-zinc-950/50 text-zinc-500">
                [Pie / Bar chart – add Recharts here]
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Stats */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-zinc-100">
            This Month Overview
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-400">
                  {monthly.sessions}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Points Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-400">
                  {monthly.points.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-400">
                  {monthly.longestStreak} days
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Most Productive Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium text-zinc-200">
                  {monthly.mostProductiveDay}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// // src/app/(app)/progress/page.tsx
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function ProgressPage() {
//   // Dummy stats — replace with real Prisma data later
//   const weeklyStats = {
//     sessions: 12,
//     pointsEarned: 1450,
//     streakDays: 8,
//     bestSession: "52 min Hyperfocus",
//   };

//   const monthlyStats = {
//     sessions: 45,
//     pointsEarned: 6200,
//     longestStreak: 14,
//     mostProductiveDay: "Wednesday",
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//       <div className="mx-auto max-w-5xl space-y-12">
//         {/* Header – Back button + title/subtitle all aligned left */}
//         <div className="flex flex-col items-start gap-6">
//           {/* Back button */}
//           <Button
//             variant="outline"
//             size="sm"
//             asChild
//             className="gap-2 border-zinc-300 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
//           >
//             <Link href="/dashboard">
//               <ArrowLeft className="h-4 w-4" />
//               Back to Dashboard
//             </Link>
//           </Button>

//           {/* Title & subtitle – left-aligned */}
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
//               Progress & Insights
//             </h1>
//             <p className="mt-3 text-lg text-zinc-600 sm:text-xl dark:text-zinc-400">
//               See how far you've come. Celebrate your focus journey.
//             </p>
//           </div>
//         </div>

//         {/* Weekly Stats */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
//             This Week
//           </h2>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Sessions Completed
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">{weeklyStats.sessions}</div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Focus Points Earned
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
//                   {weeklyStats.pointsEarned}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Current Streak
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
//                   {weeklyStats.streakDays} days
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Best Session
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-lg font-medium">
//                   {weeklyStats.bestSession}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Monthly Stats */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
//             This Month
//           </h2>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Sessions Completed
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">
//                   {monthlyStats.sessions}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Focus Points Earned
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
//                   {monthlyStats.pointsEarned}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Longest Streak
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
//                   {monthlyStats.longestStreak} days
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200 dark:border-zinc-800">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                   Most Productive Day
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-lg font-medium">
//                   {monthlyStats.mostProductiveDay}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Placeholder for charts */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
//             Weekly Focus Trends
//           </h2>
//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardContent className="pt-6">
//               <div className="flex h-64 items-center justify-center text-zinc-500 dark:text-zinc-400">
//                 [Chart placeholder – Add Recharts or similar here later]
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
