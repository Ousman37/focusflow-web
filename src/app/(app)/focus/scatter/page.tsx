// src/app/(app)/focus/scatter/page.tsx
import FocusTimer from "@/components/focus/FocusTimer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ScatterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent dark:from-white/3" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header with Back button – more breathing room */}
        <div className="mb-20 flex flex-col items-start gap-8">
          {/* Back button – smaller, subtler */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 text-zinc-600 transition-all hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Title + description – centered-ish, with space */}
          <div className="w-full text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
              Scatterfocus Mode
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 sm:mx-0 sm:text-xl dark:text-zinc-400">
              Capture ideas. Reflect freely. Recharge your mind.
            </p>
          </div>
        </div>

        {/* Timer – centered */}
        <FocusTimer mode="scatter" />
      </div>
    </div>
  );
}
