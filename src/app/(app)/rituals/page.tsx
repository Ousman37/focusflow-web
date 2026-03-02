// src/app/(app)/rituals/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RitualList from "@/components/rituals/RitualList";
import AddRitualDialog from "@/components/rituals/AddRitualDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Ritual type (adjust to Prisma later)
type Ritual = {
  id: string;
  name: string;
  description?: string | null;
  frequency: string;
  completedToday: boolean;
  streak: number;
};

export default function RitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch (replace with Prisma)
    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      setRituals([
        {
          id: "1",
          name: "Morning coffee no phone",
          frequency: "Daily",
          completedToday: true,
          streak: 7,
        },
        {
          id: "2",
          name: "10 min meditation",
          frequency: "Daily",
          completedToday: false,
          streak: 3,
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAdd = async (data: any) => {
    // Simulate Prisma create
    await new Promise((r) => setTimeout(r, 800));
    const newRitual: Ritual = {
      id: Date.now().toString(),
      ...data,
      completedToday: false,
      streak: 0,
    };
    setRituals((prev) => [...prev, newRitual]);
    toast.success("Ritual added!");
  };

  const handleToggle = (id: string) => {
    setRituals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              completedToday: !r.completedToday,
              streak: !r.completedToday ? r.streak + 1 : 0,
            }
          : r
      )
    );
    toast.success("Ritual updated!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-8 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Improved Header with Back button */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Daily Rituals
              </h1>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                Build consistency. Track your habits. Boost long-term focus.
              </p>
            </div>
          </div>

          <AddRitualDialog onAdd={handleAdd} />
        </div>

        {/* List */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <RitualList
            rituals={rituals}
            loading={loading}
            onToggle={handleToggle}
          />
        )}
      </div>
    </div>
  );
}
