// src/components/landing/Features.tsx
import {
  Shield,
  Activity,
  Zap,
  Calendar,
  BarChart,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Distraction-free timer",
    desc: "Block sites/apps during focus blocks.",
    color: "indigo",
  },
  {
    icon: Activity,
    title: "Mood & energy tracking",
    desc: "Log how you feel — see patterns over time.",
    color: "teal",
  },
  {
    icon: Zap,
    title: "Streak & badge system",
    desc: "Build habits with visual rewards.",
    color: "purple",
  },
  {
    icon: Calendar,
    title: "Daily intention setting",
    desc: "Start each day with clarity.",
    color: "amber",
  },
  {
    icon: BarChart,
    title: "Weekly insights dashboard",
    desc: "See what actually works for you.",
    color: "emerald",
  },
  {
    icon: Smartphone,
    title: "Cross-device sync",
    desc: "Pick up where you left off — anywhere.",
    color: "pink",
  },
];

export default function Features() {
  return (
    <section className="bg-muted/30 w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Everything you need to master attention
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`
                group relative rounded-2xl border border-border bg-card p-6
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                hover:border-${feature.color}-500/60 hover:bg-${feature.color}-50/30
                dark:hover:border-${feature.color}-400/60 dark:hover:bg-${feature.color}-950/20
              `}
            >
              <div className={`
                mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                bg-${feature.color}-500/10 text-${feature.color}-600
                transition-all duration-300
                group-hover:bg-${feature.color}-500/20 group-hover:scale-110 group-hover:shadow-md
                dark:bg-${feature.color}-600/15 dark:text-${feature.color}-400
                dark:group-hover:bg-${feature.color}-600/25 dark:group-hover:text-${feature.color}-300
              `}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
