// src/components/landing/PricingTeaser.tsx
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingTeaser() {
  return (
    <section className="bg-background w-full py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
          Simple, fair pricing
        </h2>
        <p className="mb-12 text-lg text-muted-foreground">
          Start free — no credit card needed. Upgrade anytime.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="
            group relative rounded-2xl border border-primary/30 bg-card p-8
            shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/60 hover:scale-[1.02]
          ">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Perfect for getting started
              </p>
            </div>

            <ul className="mb-8 space-y-3 text-left text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Limited focus sessions per day
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Basic streak & mood tracking
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Core Hyperfocus & Scatterfocus modes
              </li>
            </ul>

            <Button
              variant="outline"
              className="
                h-14 w-full rounded-full border-primary/40 text-primary
                text-lg font-semibold shadow-md transition-all duration-300
                hover:bg-primary/5 hover:border-primary/60 hover:shadow-lg
                active:scale-[0.98] sm:w-auto
                dark:border-primary/30 dark:hover:bg-primary/10 dark:hover:border-primary/50
              "
            >
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan – colorful border & badge */}
          <div className="
            group relative rounded-2xl border-2 border-primary bg-card p-8
            shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/80 hover:scale-[1.02]
            before:absolute before:inset-0 before:rounded-2xl
            before:bg-linear-to-br before:from-primary/10 before:via-transparent before:to-accent/10
            before:opacity-0 hover:before:opacity-100 before:transition-opacity
          ">
            {/* Most Popular badge – gradient card style */}
            <div className="
              absolute -top-3 left-1/2 -translate-x-1/2
              rounded-full px-5 py-1.5 text-xs font-semibold
              bg-linear-to-r from-indigo-600 to-teal-600
              text-white shadow-lg shadow-primary/30
              ring-1 ring-primary/20 backdrop-blur-sm
              transition-all duration-300
              group-hover:scale-105 group-hover:shadow-primary/40 group-hover:ring-primary/30
              dark:from-indigo-500 dark:to-teal-500
              dark:group-hover:from-indigo-600 dark:group-hover:to-teal-600
            ">
              Most Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">Pro</h3>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-primary">$9</span>
                <span className="text-sm text-muted-foreground">/mo</span>
                <span className="ml-2 text-sm text-muted-foreground">or $96/yr</span>
              </div>
            </div>

            <ul className="mb-8 space-y-3 text-left text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Unlimited focus sessions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Advanced analytics & insights
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Custom rituals & intention templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Priority support & future features
              </li>
            </ul>

            <Button
              className="
                group h-14 w-full rounded-full
                bg-linear-to-r from-indigo-600 to-teal-600
                px-10 text-lg font-semibold text-white
                shadow-lg transition-all duration-300
                hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700
                hover:shadow-xl active:scale-[0.98]
                dark:from-indigo-500 dark:to-teal-500
                dark:hover:from-indigo-600 dark:hover:to-teal-600
              "
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// src/components/landing/PricingTeaser.tsx
// import { Button } from "@/components/ui/button";
// import { Check, Sparkles } from "lucide-react";

// export default function PricingTeaser() {
//   return (
//     <section className="bg-background w-full py-16 md:py-24">
//       <div className="mx-auto max-w-5xl px-6 text-center">
//         <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
//           Simple, fair pricing
//         </h2>
//         <p className="mb-12 text-lg text-muted-foreground">
//           Start free — no credit card needed. Upgrade anytime.
//         </p>

//         <div className="grid gap-8 md:grid-cols-2">
//           {/* Free Plan */}
//           <div className="
//             group relative rounded-2xl border border-border/60 bg-card p-8
//             shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30
//           ">
//             <div className="mb-6">
//               <h3 className="text-2xl font-bold">Free</h3>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Perfect for getting started
//               </p>
//             </div>

//             <ul className="mb-8 space-y-3 text-left text-sm text-muted-foreground">
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Limited focus sessions per day
//               </li>
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Basic streak & mood tracking
//               </li>
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Core Hyperfocus & Scatterfocus modes
//               </li>
//             </ul>

//             <Button variant="outline" className="w-full">
//               Get Started Free
//             </Button>
//           </div>

//           {/* Pro Plan – highlighted */}
//           <div className="
//             group relative rounded-2xl border-2 border-primary bg-card p-8
//             shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
//             before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br
//             before:from-primary/10 before:via-transparent before:to-accent/10 before:opacity-0
//             hover:before:opacity-100 before:transition-opacity
//           ">
//             <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
//               Most Popular
//             </div>

//             <div className="mb-6">
//               <h3 className="text-2xl font-bold">Pro</h3>
//               <div className="mt-2 flex items-baseline justify-center gap-1">
//                 <span className="text-3xl font-bold text-primary">$9</span>
//                 <span className="text-sm text-muted-foreground">/mo</span>
//                 <span className="ml-2 text-sm text-muted-foreground">or $96/yr</span>
//               </div>
//             </div>

//             <ul className="mb-8 space-y-3 text-left text-sm">
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Unlimited focus sessions
//               </li>
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Advanced analytics & insights
//               </li>
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Custom rituals & intention templates
//               </li>
//               <li className="flex items-center gap-2">
//                 <Check className="h-4 w-4 text-primary" />
//                 Priority support & future features
//               </li>
//             </ul>

//             <Button className="w-full bg-primary hover:bg-primary/90">
//               Upgrade to Pro
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
