// src/components/landing/Testimonials.tsx
import { Star } from "lucide-react";

const quotes = [
  {
    text: "Reclaimed 3 hours a day. Game changer.",
    author: "Sarah K.",
    role: "Engineer",
  },
  {
    text: "Finally a tool that understands scatterfocus is not procrastination.",
    author: "Alex T.",
    role: "Designer",
  },
  {
    text: "The streak system keeps me coming back every day. Love it.",
    author: "Marcus L.",
    role: "Freelancer",
  },
  {
    text: "Best focus app I've tried — clean, no bloat.",
    author: "Lena M.",
    role: "Product Manager",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-background w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          What people are saying
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((quote, i) => (
            <div
              key={i}
              className="
                group relative rounded-2xl border border-border bg-card p-6
                transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                hover:border-primary/60 hover:bg-primary/5
                dark:hover:border-primary/50 dark:hover:bg-primary/10
              "
            >
              <div className="mb-4 flex">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="mb-4 text-lg font-medium italic text-foreground">
                "{quote.text}"
              </p>
              <p className="text-sm text-muted-foreground">
                — {quote.author}, {quote.role}
              </p>

              {/* Subtle accent line on hover */}
              <div className="
                absolute bottom-0 left-0 h-1 w-0 rounded-r-full
                bg-linear-to-r from-indigo-600 to-teal-600
                transition-all duration-400 group-hover:w-full
                dark:from-indigo-500 dark:to-teal-500
              " />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
