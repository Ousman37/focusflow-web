"use client";

// src/components/layout/GlobalHeader.tsx

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function GlobalHeader() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasCookie = document.cookie.includes("firebaseUid=");
    setIsAuthenticated(hasCookie);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-border bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo with colored icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground text-xl font-bold tracking-tight transition-opacity hover:opacity-90"
        >
          <Zap className="h-6 w-6 text-primary" />
          FocusFlow
        </Link>

        {/* ---------------- Desktop ---------------- */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative transition-transform hover:scale-105"
              aria-label="Toggle theme"
            >
              <Sun
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  resolvedTheme === "dark"
                    ? "scale-0 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                )}
              />
              <Moon
                className={cn(
                  "absolute h-5 w-5 transition-all duration-300",
                  resolvedTheme === "dark"
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-0 -rotate-90 opacity-0"
                )}
              />
            </Button>
          )}

          {isAuthenticated ? (
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              {/* Log in – subtle outline with primary accent */}
              <Button
                variant="outline"
                asChild
                className="border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors"
              >
                <Link href="/auth/login">Log in</Link>
              </Button>

              {/* Sign up free – strong gradient button */}
              <Button
                asChild
                className="
                  bg-linear-to-r from-indigo-600 to-teal-600
                  text-white hover:from-indigo-700 hover:to-teal-700
                  transition-all duration-300
                  dark:from-indigo-500 dark:to-teal-500
                  dark:hover:from-indigo-600 dark:hover:to-teal-600
                "
              >
                <Link href="/auth/signup">Sign up free</Link>
              </Button>
            </>
          )}
        </div>

        {/* ---------------- Mobile ---------------- */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="transition-transform hover:scale-105"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="text-foreground h-6 w-6" />
            ) : (
              <Menu className="text-foreground h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* ---------------- Mobile Dropdown ---------------- */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-border bg-background flex flex-col gap-4 border-t px-4 py-6">
          {isAuthenticated ? (
            <>
              <Button asChild onClick={() => setIsMenuOpen(false)}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/focus/hyper">Start Focus</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/journal">Journal</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/settings">Settings</Link>
              </Button>
            </>
          ) : (
            <>
              {/* Log in – mobile version */}
              <Button
                variant="outline"
                asChild
                className="border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors"
              >
                <Link href="/auth/login">Log in</Link>
              </Button>

              {/* Sign up free – mobile version */}
              <Button
                asChild
                className="
                  bg-linear-to-r from-indigo-600 to-teal-600
                  text-white hover:from-indigo-700 hover:to-teal-700
                  transition-all duration-300
                  dark:from-indigo-500 dark:to-teal-500
                  dark:hover:from-indigo-600 dark:hover:to-teal-600
                "
              >
                <Link href="/auth/signup">Sign up free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
