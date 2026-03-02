//src/app/(app)/focus/timer/page.tsx
import FocusTimer from "@/components/focus/FocusTimer";
import DistractionBlocker from "@/components/focus/DistractionBlocker";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TimerPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-indigo-50 via-white to-teal-50 px-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Back Navigation */}
      <div className="absolute top-6 left-6">
        <Link href="/dashboard">
          <Button variant="ghost">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Timer Card */}
      <div className="w-full max-w-xl rounded-2xl bg-white/80 p-10 shadow-xl backdrop-blur-md dark:bg-zinc-900/70">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Deep Focus Session
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Remove distractions. Enter hyperfocus.
          </p>
        </div>

        <div className="space-y-8">
          <DistractionBlocker />
          <FocusTimer mode="hyper" />
        </div>
      </div>
    </div>
  );
}
