"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DistractionBlocker() {
  const [blocked, setBlocked] = useState(false);

  return (
    <button
      onClick={() => setBlocked(!blocked)}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium backdrop-blur-md transition-all duration-300",
        blocked
          ? "bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          : "bg-white/40 text-zinc-600 hover:bg-white/60 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
      )}
    >
      {/* Status Dot */}
      <span className="relative flex h-3 w-3">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 transition-all",
            blocked ? "animate-ping bg-indigo-500 dark:bg-indigo-400" : "hidden"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-3 w-3 rounded-full transition-all duration-300",
            blocked
              ? "bg-indigo-600 dark:bg-indigo-400"
              : "bg-zinc-400 dark:bg-zinc-600"
          )}
        />
      </span>

      {blocked ? "Distraction Blocking Active" : "Enable Distraction Block"}
    </button>
  );
}
