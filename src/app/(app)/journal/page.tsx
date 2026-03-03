// src/app/(app)/journal/page.tsx
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { getServerSessionUser } from "@/lib/auth";
import JournalClient, { JournalEntryDTO } from "@/components/journal/JournalClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function JournalPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch entries
  const entries = await db.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedEntries: JournalEntryDTO[] = entries.map((entry: typeof entries[number]) => ({
    id: entry.id,
    content: entry.content,
    createdAt: entry.createdAt.toISOString(),
    mood: entry.mood ?? undefined,
    theme: entry.theme ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header with Back button */}
        <div className="flex flex-col items-start gap-8">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Journal
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              Capture thoughts without friction. Reflect freely.
            </p>
          </div>
        </div>

        {/* Client component – now passes userId */}
        <JournalClient entries={serializedEntries} userId={user.id} />
      </div>
    </div>
  );
}


// // src/app/(app)/journal/page.tsx
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/prisma";
// import { getServerSessionUser } from "@/lib/auth";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import JournalClient, {
//   JournalEntryDTO,
// } from "@/components/journal/JournalClient";

// export default async function JournalPage() {
//   const user = await getServerSessionUser();

//   if (!user) {
//     redirect("/auth/login");
//   }

//   const entries = await db.journalEntry.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   });

//   const serializedEntries: JournalEntryDTO[] = entries.map((entry) => ({
//     id: entry.id,
//     content: entry.content,
//     createdAt: entry.createdAt.toISOString(),
//   }));

//   return (
//     <div className="bg-background min-h-screen from-zinc-100 via-zinc-200/50 to-zinc-50 px-4 py-10 sm:px-6 lg:px-12 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950">
//       <div className="mx-auto max-w-4xl space-y-12">
//         {/* Header – Back button + title/subtitle aligned left with breathing room */}
//         <div className="flex flex-col items-start gap-8">
//           {/* Back button – prominent, left-aligned */}
//           <Button
//             variant="outline"
//             size="sm"
//             asChild
//             className="gap-2 border-zinc-300 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
//           >
//             <Link href="/dashboard">
//               <ArrowLeft className="h-4 w-4" />
//               Back to Dashboard
//             </Link>
//           </Button>

//           {/* Title & subtitle – good separation */}
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl lg:text-5xl dark:text-indigo-400">
//               Journal
//             </h1>
//             <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
//               Capture thoughts without friction. Reflect freely.
//             </p>
//           </div>
//         </div>

//         {/* Client-side journal component */}
//         <JournalClient entries={serializedEntries} />
//       </div>
//     </div>
//   );
// }
