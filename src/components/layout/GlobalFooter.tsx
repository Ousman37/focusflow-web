export default function GlobalFooter() {
  return (
    <footer className="relative py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
      {/* Subtle fade divider instead of hard border */}
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

      <div className="mx-auto max-w-7xl px-6">
        <p className="tracking-tight">
          © {new Date().getFullYear()} FocusFlow. All rights reserved.
        </p>

        <div className="mt-3 flex justify-center gap-8 text-zinc-400 dark:text-zinc-500">
          <a
            href="/terms"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Terms
          </a>
          <a
            href="/privacy"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Privacy
          </a>
          <a
            href="https://x.com/Ethamne_dev"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            @Ethamne_dev
          </a>
        </div>
      </div>
    </footer>
  );
}
