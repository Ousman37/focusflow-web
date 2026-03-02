// src/components/common/DailyQuote.tsx
"use client";

import { quotes } from "@/lib/quotes";

export default function DailyQuote() {
  // Daily seeded quote (same all day)
  const today = new Date().toDateString();
  const seed = today
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % quotes.length;
  const quote = quotes[index];

  return (
    <div className="my-8 text-center">
      <p className="text-foreground/80 dark:text-foreground/70 text-lg leading-relaxed font-medium tracking-wide italic md:text-xl">
        “{quote}”
      </p>
      <p className="text-muted-foreground/80 mt-2 text-sm font-light">
        — Inspired by Hyperfocus
      </p>
    </div>
  );
}
