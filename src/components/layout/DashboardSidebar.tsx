"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Home,
  Settings,
  Zap,
  Play,
  Flame,
  History,
} from "lucide-react";
import Link from "next/link";

const focusItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hyperfocus", href: "/focus/hyper", icon: Zap },
  { name: "Scatterfocus", href: "/focus/scatter", icon: BookOpen },
];

const reflectItems = [
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Rituals", href: "/rituals", icon: Calendar },
];

const growthItems = [
  { name: "Progress", href: "/progress", icon: Activity },
  { name: "Session History", href: "/sessions", icon: History },
  { name: "Rewards", href: "/rewards", icon: Award },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState<number>(0);
  const [animateStreak, setAnimateStreak] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(0);
  const previousStreak = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/stats/streak");
        if (!res.ok) return;
        const data = await res.json();

        if (data.streak > previousStreak.current) {
          setAnimateStreak(true);
          setTimeout(() => setAnimateStreak(false), 1500);
        }

        previousStreak.current = data.streak;
        setStreak(data.streak);
      } catch {}
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    const fetchWeeklyProgress = async () => {
      try {
        const res = await fetch("/api/sessions/weekly-progress");
        if (!res.ok) return;
        const data = await res.json();
        setWeeklyProgress(data.progress ?? 0);
      } catch {}
    };

    fetchWeeklyProgress();
  }, []);

  const renderNavItem = (item: any) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/15 text-primary dark:bg-primary/25"
            : "text-muted-foreground hover:bg-[#333333] hover:text-white"
        )}
      >
        {isActive && (
          <span className="bg-primary absolute top-2 bottom-2 left-0 w-1 rounded-r-full" />
        )}
        <item.icon className="h-5 w-5 transition-colors duration-200 group-hover:text-white" />
        <span className="transition-colors duration-200 group-hover:text-white">
          {item.name}
        </span>
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <aside className="bg-background hidden h-screen w-72 flex-col border-r border-[#515151] lg:flex">
      {/* Header */}
      <div className="border-border/30 flex items-center justify-between border-b px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-primary/10 dark:bg-primary/15 rounded-2xl p-3">
            <Zap className="text-primary h-6 w-6" />
          </div>
          <span className="text-foreground text-xl font-bold tracking-tight">
            FocusFlow
          </span>
        </Link>
      </div>

      {/* Streak */}
      <div className="px-6 pt-4">
        <div
          className={cn(
            "relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-500",
            "bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
            animateStreak && "scale-110"
          )}
        >
          {animateStreak && (
            <span className="absolute inset-0 animate-ping rounded-full bg-orange-400/30 blur-xl" />
          )}
          <Flame className={cn("h-4 w-4", animateStreak && "animate-bounce")} />
          {streak} day streak
        </div>
      </div>

      {/* CTA + Weekly Progress */}
      <div className="space-y-4 px-6 py-6">
        <Link
          href="/focus/hyper"
          className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-600"
        >
          <Play className="h-4 w-4" />
          Start Focus Session
        </Link>

        <div className="bg-card/50 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Weekly Goal</span>
            <span className="font-semibold">{weeklyProgress}%</span>
          </div>

          <div className="bg-muted/60 mt-2 h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-teal-500 transition-all duration-700"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto px-4 pb-6">
        <div>
          <p className="mx-2 mb-3 rounded-lg bg-zinc-200/60 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:bg-zinc-800/60 dark:text-zinc-300">
            Focus
          </p>
          <div className="space-y-1">{focusItems.map(renderNavItem)}</div>
        </div>

        <div>
          <p className="mx-2 mb-3 rounded-lg bg-zinc-200/60 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:bg-zinc-800/60 dark:text-zinc-300">
            Reflect
          </p>
          <div className="space-y-1">{reflectItems.map(renderNavItem)}</div>
        </div>

        <div>
          <p className="mx-2 mb-3 rounded-lg bg-zinc-200/60 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:bg-zinc-800/60 dark:text-zinc-300">
            Growth
          </p>
          <div className="space-y-1">{growthItems.map(renderNavItem)}</div>
        </div>
      </nav>

      {/* Bottom Profile */}
      <div className="border-border/30 mt-auto border-t p-4">
        <Link
          href="/profile"
          className="bg-muted/30 flex items-center gap-3 rounded-2xl p-3 transition hover:bg-[#333333] hover:text-white"
        >
          <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Your Name</span>
            <span className="text-muted-foreground text-xs">Free Plan</span>
          </div>
        </Link>

        {renderNavItem({
          name: "Settings",
          href: "/settings",
          icon: Settings,
        })}
      </div>
    </aside>
  );
}
