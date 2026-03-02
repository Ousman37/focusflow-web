// src/components/rewards/BadgeGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";

type Badge = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string; // emoji for now
  progress?: string; // e.g. "4/10 sessions" for locked badges
  rarity?: "common" | "rare" | "epic"; // future styling
};

export default function BadgeGrid() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch — later: Prisma + user-specific unlocked status
    const fetchBadges = async () => {
      await new Promise((r) => setTimeout(r, 900));
      setBadges([
        // Original set (slightly polished)
        {
          id: "1",
          name: "First Spark",
          description: "Complete your very first focus session",
          unlocked: true,
          icon: "✨",
          rarity: "common",
        },
        {
          id: "2",
          name: "Session Stacker",
          description: "Reach 5 total focus sessions",
          unlocked: true,
          icon: "🔥",
          rarity: "common",
        },
        {
          id: "3",
          name: "Double Digits",
          description: "Complete 10 focus sessions",
          unlocked: false,
          icon: "🔒",
          progress: "7/10",
          rarity: "common",
        },
        {
          id: "4",
          name: "Point Collector",
          description: "Earn 1,000 focus points",
          unlocked: false,
          icon: "💎",
          progress: "420/1000",
          rarity: "rare",
        },
        {
          id: "5",
          name: "Week Warrior",
          description: "Maintain a 7-day focus streak",
          unlocked: true,
          icon: "🏆",
          rarity: "rare",
        },
        {
          id: "6",
          name: "Hyperfocus Initiate",
          description: "Complete a 50+ minute deep session",
          unlocked: false,
          icon: "🧠",
          progress: "42 min best",
          rarity: "epic",
        },
        {
          id: "7",
          name: "Journal Jedi",
          description: "Write 5 journal entries after sessions",
          unlocked: true,
          icon: "📝",
          rarity: "rare",
        },

        // ── New badges ───────────────────────────────────────────────────────
        {
          id: "8",
          name: "Morning Momentum",
          description: "Start a session before 10 AM (3 times)",
          unlocked: false,
          icon: "🌅",
          progress: "1/3",
          rarity: "common",
        },
        {
          id: "9",
          name: "Quick Win",
          description: "Finish a session of 15+ minutes",
          unlocked: true,
          icon: "⚡",
          rarity: "common",
        },
        {
          id: "10",
          name: "Deep Dive",
          description: "Complete a 90+ minute focus session",
          unlocked: false,
          icon: "🌊",
          progress: "Best: 68 min",
          rarity: "rare",
        },
        {
          id: "11",
          name: "Flow State",
          description: "Maintain focus for 45+ continuous minutes",
          unlocked: false,
          icon: "🌀",
          progress: "Best: 38 min",
          rarity: "epic",
        },
        {
          id: "12",
          name: "Fortnight Fighter",
          description: "Maintain a 14-day focus streak",
          unlocked: false,
          icon: "🛡️",
          progress: "Current: 7 days",
          rarity: "rare",
        },
        {
          id: "13",
          name: "Reflection Rookie",
          description: "Write 10 journal entries",
          unlocked: true,
          icon: "🖋️",
          rarity: "common",
        },
        {
          id: "14",
          name: "Daily Chronicler",
          description: "Journal after every session for 7 days in a row",
          unlocked: false,
          icon: "📓",
          progress: "Current: 4 days",
          rarity: "rare",
        },
        {
          id: "15",
          name: "5k Point Pioneer",
          description: "Reach 5,000 focus points",
          unlocked: false,
          icon: "🪙",
          progress: "1,240/5000",
          rarity: "rare",
        },
        {
          id: "16",
          name: "Intent Architect",
          description: "Set and complete a daily intention 5 times",
          unlocked: false,
          icon: "🎯",
          progress: "2/5",
          rarity: "common",
        },
        {
          id: "17",
          name: "Clutter Crusher",
          description:
            "Start a session after journaling 'what to ignore today'",
          unlocked: true,
          icon: "🧹",
          rarity: "common",
        },
        {
          id: "18",
          name: "30-Day Legend",
          description: "Maintain a 30-day focus streak",
          unlocked: false,
          icon: "👑",
          progress: "7 days",
          rarity: "epic",
        },
        {
          id: "19",
          name: "No-Zero Month",
          description: "Every day in a calendar month has at least one session",
          unlocked: false,
          icon: "📅",
          progress: "In progress",
          rarity: "epic",
        },
        {
          id: "20",
          name: "Back on Track",
          description: "Complete a session after missing at least one day",
          unlocked: true,
          icon: "🔄",
          rarity: "common",
        },
      ]);
      setLoading(false);
    };
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700"
          />
        ))}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
        <Sparkles className="mx-auto h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        <h3 className="mt-4 text-xl font-semibold text-zinc-700 dark:text-zinc-200">
          No badges unlocked yet
        </h3>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Start a focus session and watch your rewards collection grow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Rewards Gallery
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Keep going — more to unlock!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-center shadow transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
              badge.unlocked
                ? "border-indigo-400/60 bg-linear-to-br from-indigo-50 via-purple-50 to-teal-50 dark:border-indigo-500/50 dark:from-indigo-950/50 dark:via-purple-950/40 dark:to-teal-950/50"
                : "border-zinc-200 bg-zinc-50/60 opacity-80 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/40"
            }`}
          >
            <div
              className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-transform duration-500 ${
                badge.unlocked
                  ? "bg-linear-to-br from-indigo-400 to-teal-400 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6"
                  : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              {badge.icon}
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {badge.name}
            </h3>

            <p className="mt-2 min-h-12 text-sm text-zinc-600 dark:text-zinc-300">
              {badge.description}
            </p>

            <div className="mt-4">
              {badge.unlocked ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  <Flame className="h-4 w-4" /> Unlocked
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Locked
                  </span>
                  {badge.progress && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {badge.progress}
                    </p>
                  )}
                </div>
              )}
            </div>

            {badge.unlocked && (
              <div className="absolute -top-12 -right-12 h-24 w-24 rotate-12 bg-white/20 blur-xl group-hover:bg-white/30 dark:bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// src/components/rewards/BadgeGrid.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Flame } from "lucide-react";

// type Badge = {
//   id: string;
//   name: string;
//   description?: string;
//   unlocked: boolean;
//   icon?: string; // future: emoji or image path
// };

// export default function BadgeGrid() {
//   const [badges, setBadges] = useState<Badge[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API / Prisma fetch – replace with real db.badge.findMany later
//     const fetchBadges = async () => {
//       await new Promise((r) => setTimeout(r, 800));
//       setBadges([
//         {
//           id: "1",
//           name: "First Session",
//           description: "Complete your first focus session",
//           unlocked: false,
//         },
//         {
//           id: "2",
//           name: "5 Sessions",
//           description: "Reach 5 total sessions",
//           unlocked: false,
//         },
//         {
//           id: "3",
//           name: "10 Sessions",
//           description: "Reach 10 total sessions",
//           unlocked: false,
//         },
//         {
//           id: "4",
//           name: "1000 Points",
//           description: "Accumulate 1000 focus points",
//           unlocked: false,
//         },
//         {
//           id: "5",
//           name: "7 Day Streak",
//           description: "Maintain a 7-day focus streak",
//           unlocked: true,
//         },
//       ]);
//       setLoading(false);
//     };
//     fetchBadges();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i}
//             className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (badges.length === 0) {
//     return (
//       <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
//         <h3 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
//           No badges yet
//         </h3>
//         <p className="mt-2 text-zinc-500 dark:text-zinc-400">
//           Complete sessions and build streaks to start earning rewards.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       {badges.map((badge) => (
//         <div
//           key={badge.id}
//           className={`group relative rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
//             badge.unlocked
//               ? "border-indigo-300 bg-linear-to-br from-indigo-50 to-teal-50 dark:border-indigo-700/60 dark:from-indigo-950/40 dark:to-teal-950/40"
//               : "border-zinc-200 bg-zinc-50/70 opacity-75 dark:border-zinc-800 dark:bg-zinc-900/50"
//           }`}
//         >
//           {/* Icon placeholder – future: use real icons/emojis */}
//           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-3xl dark:bg-zinc-700">
//             {badge.unlocked ? "🏆" : "🔒"}
//           </div>

//           <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
//             {badge.name}
//           </h3>

//           {badge.description && (
//             <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//               {badge.description}
//             </p>
//           )}

//           <p className="mt-3 text-sm font-medium">
//             {badge.unlocked ? (
//               <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
//                 Unlocked <Flame className="h-4 w-4" />
//               </span>
//             ) : (
//               <span className="text-zinc-500 dark:text-zinc-400">Locked</span>
//             )}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }
