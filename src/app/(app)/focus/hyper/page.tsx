// src/app/(app)/focus/hyper/page.tsx
import FocusTimer from "@/components/focus/FocusTimer";
import DistractionBlocker from "@/components/focus/DistractionBlocker";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HyperPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-zinc-200/40 via-zinc-100/30 to-white px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent dark:from-white/3" />

      <div className="relative mx-auto max-w-5xl">
        {/* Top Navigation */}
        <div className="mb-10 pl-6 sm:pl-12 lg:pl-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Title + blocker */}
        <div className="mb-16 pl-6 sm:pl-12 lg:pl-16">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            Hyperfocus Mode
          </h1>
          <div className="mt-5">
            <DistractionBlocker />
          </div>
        </div>

        {/* Timer */}
        <FocusTimer mode="hyper" />
      </div>
    </div>
  );
}

// import FocusTimer from "@/components/focus/FocusTimer";
// import DistractionBlocker from "@/components/focus/DistractionBlocker";

// export default function HyperPage() {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-zinc-200/40 via-zinc-100/30 to-white px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//       {/* Very subtle overlay for depth */}
//       <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent dark:from-white/3" />

//       <div className="relative mx-auto max-w-5xl">
//         {/* Title + blocker with left margin */}
//         <div className="mb-16 pl-6 sm:pl-12 lg:pl-16">
//           <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
//             Hyperfocus Mode
//           </h1>
//           <div className="mt-5">
//             <DistractionBlocker />
//           </div>
//         </div>

//         {/* Timer */}
//         <FocusTimer mode="hyper" />
//       </div>
//     </div>
//   );
// }
