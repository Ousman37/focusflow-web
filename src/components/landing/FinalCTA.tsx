// src/components/landing/FinalCTA.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-primary w-full py-16 text-center md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-primary-foreground mb-6 text-3xl font-bold tracking-tight md:text-4xl">
          Ready to focus better today?
        </h2>
        <Button
          size="lg"
          asChild
          className="group h-14 w-full max-w-xs rounded-full bg-linear-to-r from-indigo-600 to-teal-600 px-10 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700 hover:shadow-xl active:scale-[0.98] sm:w-auto dark:from-indigo-500 dark:to-teal-500 dark:hover:from-indigo-600 dark:hover:to-teal-600"
        >
          <Link href="/auth/signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
}
