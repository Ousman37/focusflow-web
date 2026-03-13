// src/components/rituals/RitualList.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trash2 } from "lucide-react";

type Ritual = {
  id: string;
  name: string;
  description?: string | null;
  frequency: string;
  completedToday: boolean;
  streak: number;
};

type RitualListProps = {
  rituals: Ritual[];
  loading: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function RitualList({
  rituals,
  loading,
  onToggle,
  onDelete,
}: RitualListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (rituals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <h3 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
          No rituals yet
        </h3>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Add your first ritual to start building habits.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rituals.map((ritual) => (
        <Card
          key={ritual.id}
          className="border-zinc-200 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg leading-tight">
                  {ritual.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {ritual.frequency}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={ritual.completedToday}
                  onCheckedChange={() => onToggle(ritual.id)}
                  className="mt-1 border-zinc-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                />
                {onDelete && (
                  <button
                    onClick={() => onDelete(ritual.id)}
                    className="mt-1 text-zinc-400 transition-colors hover:text-red-500"
                    aria-label="Delete ritual"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Streak: {ritual.streak} day{ritual.streak !== 1 ? "s" : ""}
              </span>
              {ritual.streak >= 5 && (
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                  <Flame className="mr-1 inline h-3 w-3" />
                  Hot streak
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
