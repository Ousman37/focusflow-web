// src/components/landing/HowItWorks.tsx
import { Timer, Brain, Calendar, Trophy } from "lucide-react";

const cards = [
  {
    icon: Timer,
    title: "Hyperfocus",
    description:
      "Deep work timer with distraction blocker — lock in for hours of pure productivity.",
    color: "indigo", // primary accent
  },
  {
    icon: Brain,
    title: "Scatterfocus",
    description:
      "Idea capture + mind-mapping journal — let thoughts flow freely, then organize them.",
    color: "teal",
  },
  {
    icon: Calendar,
    title: "Daily Rituals",
    description:
      "Build habit streaks and track mood/energy — turn focus into a daily practice.",
    color: "purple",
  },
  {
    icon: Trophy,
    title: "Rewards & Progress",
    description:
      "Earn badges, maintain streaks, see insights — gamified motivation that works.",
    color: "amber",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted/30 w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Two Modes. One Goal: Deeper Focus
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`
                group relative rounded-2xl border border-border bg-card p-6
                transition-all duration-300 hover:-translate-y-2 hover:shadow-lg
                hover:border-${card.color}-500/60 hover:bg-${card.color}-50/30
                dark:hover:border-${card.color}-400/60 dark:hover:bg-${card.color}-950/20
              `}
            >
              <div className={`
                mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                bg-${card.color}-500/10 text-${card.color}-600
                transition-colors duration-300
                group-hover:bg-${card.color}-500/20 group-hover:text-${card.color}-700
                dark:bg-${card.color}-600/15 dark:text-${card.color}-400
                dark:group-hover:bg-${card.color}-600/25 dark:group-hover:text-${card.color}-300
              `}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
