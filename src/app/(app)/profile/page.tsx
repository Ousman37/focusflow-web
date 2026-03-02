import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  const sessions = await db.session.findMany({
    where: { userId: user.id, completed: true },
  });

  const totalSessions = sessions.length;

  const totalPoints = sessions.reduce((sum, s) => sum + s.pointsEarned, 0);

  // --- Streak Calculation ---
  const today = new Date();
  const uniqueDates = Array.from(
    new Set(sessions.map((s) => new Date(s.createdAt).toDateString()))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let checkDate = new Date(today);

  for (const date of uniqueDates) {
    if (new Date(date).toDateString() === checkDate.toDateString()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const avatarLetter =
    user.name?.charAt(0).toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    "U";

  const planLabel = user.subscriptionId ? "Premium Plan" : "Free Plan";

  return (
    <div className="min-h-screen bg-white px-6 py-12 dark:bg-linear-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Your FocusFlow journey overview
            </p>
          </div>
        </div>

        {/* HERO PROFILE CARD */}
        <Card className="rounded-3xl border border-zinc-200/60 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/50">
          <CardContent className="flex flex-col items-center gap-8 p-10 md:flex-row md:items-start">
            {/* Avatar */}
            <Avatar className="h-28 w-28">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name ?? ""} />
              )}
              <AvatarFallback className="bg-indigo-600 text-4xl text-white">
                {avatarLetter}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.name || "No Name Set"}
                </h2>

                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {/* Plan Badge */}
                <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {planLabel}
                </span>

                {/* Member Since */}
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <Link href="/settings">
                  <Button
                    size="sm"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STATS SECTION */}
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            label="Total Sessions"
            value={totalSessions.toString()}
            highlight="text-indigo-600 dark:text-indigo-400"
          />

          <StatCard
            label="Focus Points"
            value={totalPoints.toLocaleString()}
            highlight="text-teal-600 dark:text-teal-400"
          />

          <StatCard
            label="Current Streak"
            value={`${currentStreak} days`}
            highlight="text-amber-600 dark:text-amber-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================= */
/* REUSABLE STAT CARD COMPONENT */
/* ============================= */

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: string;
}) {
  return (
    <Card className="rounded-2xl border border-zinc-200/60 bg-white/60 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className={`text-4xl font-semibold tracking-tight ${highlight}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

// src/app/(app)/profile/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ArrowLeft, User, Settings, LogOut, Award } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";

// // Dummy user type — adjust to your Prisma + Firebase model
// type UserProfile = {
//   id: string;
//   name: string;
//   email: string;
//   image?: string | null;
//   createdAt: string;
//   totalSessions: number;
//   totalPoints: number;
//   currentStreak: number;
//   badgesUnlocked: number;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate fetch (replace with real Firebase + Prisma)
//     const fetchUser = async () => {
//       await new Promise(r => setTimeout(r, 1000));
//       setUser({
//         id: "user_123",
//         name: "Ethan Dev",
//         email: "ethamne.dev@gmail.com",
//         image: "/placeholder-avatar.jpg", // or from Firebase
//         createdAt: new Date("2025-10-15").toLocaleDateString(),
//         totalSessions: 87,
//         totalPoints: 12450,
//         currentStreak: 7,
//         badgesUnlocked: 3,
//       });
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     // Replace with real Firebase logout
//     toast.success("Logged out successfully!");
//     // router.push("/auth/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//         <div className="mx-auto max-w-5xl space-y-12">
//           <Skeleton className="h-10 w-64 rounded-lg" />
//           <div className="grid gap-6 md:grid-cols-2">
//             <Skeleton className="h-64 rounded-xl" />
//             <Skeleton className="h-64 rounded-xl" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Error</CardTitle>
//             <CardDescription>Could not load profile. Please try again.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button asChild>
//               <Link href="/dashboard">Back to Dashboard</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//       <div className="mx-auto max-w-5xl space-y-12">
//         {/* Header with Back button */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               asChild
//               className="gap-2 border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
//             >
//               <Link href="/dashboard">
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Dashboard
//               </Link>
//             </Button>

//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
//                 Profile
//               </h1>
//               <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
//                 Your FocusFlow journey and stats.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Overview */}
//         <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
//           <CardHeader className="flex flex-row items-center gap-6 pb-4">
//             <Avatar className="h-20 w-20 border-2 border-indigo-200 dark:border-indigo-800">
//               <AvatarImage src={user.image || ""} alt={user.name} />
//               <AvatarFallback className="bg-indigo-600 text-white text-2xl">
//                 {user.name.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>

//             <div>
//               <CardTitle className="text-2xl">{user.name}</CardTitle>
//               <CardDescription className="text-base mt-1">
//                 {user.email}
//               </CardDescription>
//               <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
//                 Member since {user.createdAt}
//               </p>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Stats Grid */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                 Total Sessions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
//                 {user.totalSessions}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                 Focus Points
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
//                 {user.totalPoints.toLocaleString()}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                 Current Streak
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
//                 {user.currentStreak} days
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//                 Badges Unlocked
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                 {user.badgesUnlocked}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader>
//               <CardTitle>Edit Profile</CardTitle>
//               <CardDescription>Update your name, photo, and preferences</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button variant="outline" className="w-full">
//                 Edit Profile
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader>
//               <CardTitle>Manage Subscription</CardTitle>
//               <CardDescription>Upgrade, downgrade, or view billing</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button variant="outline" className="w-full">
//                 Manage Plan
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="border-zinc-200 dark:border-zinc-800">
//             <CardHeader>
//               <CardTitle>Log Out</CardTitle>
//               <CardDescription>Sign out of your account</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button variant="destructive" className="w-full" onClick={() => {
//                 // Replace with real Firebase logout
//                 toast.success("Logged out successfully!");
//                 // router.push("/auth/login");
//               }}>
//                 Log Out
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
