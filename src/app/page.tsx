// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getServerSessionUser } from "@/lib/auth";
import GlobalHeader from "@/components/layout/GlobalHeader";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Features from "@/components/landing/Features";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FinalCTA from "@/components/landing/FinalCTA";

export default async function Home() {
  const user = await getServerSessionUser();

  return (
    <>
      {/* Header */}
      <GlobalHeader />

      <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24">
        {/* Background glows – subtle, theme-aware */}
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/5 absolute top-0 left-0 h-96 w-96 -translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl sm:h-150 sm:w-150" />
          <div className="bg-accent/5 absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full blur-3xl sm:h-150 sm:w-150" />
        </div>

        {/* Main content */}
        <div className="relative z-10 mx-auto max-w-5xl pt-20 text-center md:pt-16">
          {/* Tagline pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-5 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Inspired by Hyperfocus
          </div>

          {/* Headline */}
          <h1 className="mb-6 bg-linear-to-r from-indigo-600 via-indigo-500 to-teal-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
            FocusFlow
          </h1>

          {/* Subtitle */}
          <p className="
  mx-auto mb-12 max-w-3xl text-xl leading-relaxed
  text-foreground/90 md:text-2xl
">
  Hyperfocus + Scatterfocus — Work less, achieve more.
  <br className="hidden sm:block" />
  Master your attention. Get more done with less stress.
</p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <Button
              size="lg"
              asChild
              className="group h-14 w-full max-w-xs rounded-full bg-linear-to-r from-indigo-600 to-teal-600 px-10 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700 hover:shadow-xl active:scale-[0.98] sm:w-auto dark:from-indigo-500 dark:to-teal-500 dark:hover:from-indigo-600 dark:hover:to-teal-600"
            >
              <Link href={user ? "/dashboard" : "/auth/signup"}>
                {user ? "Continue to Dashboard" : "Start Focusing Free"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {user ? (
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 dark:border-primary/30 dark:hover:bg-primary/15 dark:hover:border-primary/50 h-14 w-full max-w-xs rounded-full text-lg font-medium transition-all duration-300 hover:shadow-sm active:scale-[0.98] sm:w-auto"
              >
                <Link href="/focus/scatter">Try Scatterfocus</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 dark:border-primary/30 dark:hover:bg-primary/15 dark:hover:border-primary/50 h-14 w-full max-w-xs rounded-full text-lg font-medium transition-all duration-300 hover:shadow-sm active:scale-[0.98] sm:w-auto"
              >
                <Link href="/auth/login">Log in</Link>
              </Button>
            )}
          </div>

          {/* Trust line */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="h-px w-24 bg-zinc-200 dark:bg-zinc-800" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Join thousands of developers, creators, and professionals who
              focus better every day
            </p>
          </div>
        </div>
        <div className="bg-background">
          <HowItWorks />
        </div>
        <div className="bg-muted/30">
          <Testimonials />
        </div>
        <div className="bg-background">
          <Features />
        </div>
        <div className="bg-background">
          <PricingTeaser />
        </div>
        <div className="bg-background">
          <FinalCTA />
        </div>
      </div>
    </>
  );
}
