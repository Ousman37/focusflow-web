// src/app/(app)/rewards/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BadgeGrid from "@/components/rewards/BadgeGrid";
import { ArrowLeft } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header – Back button + title/subtitle with proper spacing */}
        <div className="flex flex-col items-start gap-8">
          {/* Back button – left-aligned with breathing room */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-zinc-300 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Title & subtitle – left-aligned, good separation */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
              Rewards
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              Earn badges, unlock achievements, celebrate your progress.
            </p>
          </div>
        </div>

        {/* Badge Grid */}
        <BadgeGrid />
      </div>
    </div>
  );
}
