// src/components/focus/FocusTimer.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RewardConfetti from "./RewardConfetti";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Props = {
  mode: "hyper" | "scatter";
};

export default function FocusTimer({ mode }: Props) {
  const [seconds, setSeconds] = useState(1500); // 25 minutes default
  const [running, setRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Timer interval
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const startSession = async () => {
    setLoadingStart(true);
    try {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to start session");
      }

      const data = await res.json();
      if (!data.sessionId) {
        throw new Error("No session ID returned");
      }

      setSessionId(data.sessionId);
      setRunning(true);
      setCompleted(false);
      toast.success("Focus session started!");
    } catch (err: any) {
      console.error("Start session error:", err);
      toast.error(err.message || "Failed to start session");
    } finally {
      setLoadingStart(false);
    }
  };

  const pauseSession = () => {
    setRunning(false);
  };

  const resumeSession = () => {
    setRunning(true);
  };

  const finishSession = async () => {
    if (!sessionId) return;

    setLoadingComplete(true);
    try {
      const res = await fetch("/api/sessions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to complete session");
      }

      setCompleted(true);
      setRunning(false);
      toast.success("Session completed! Great job! 🎉");
    } catch (err: any) {
      console.error("Complete session error:", err);
      toast.error(err.message || "Failed to complete session");
    } finally {
      setLoadingComplete(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-24">
      {/* Background ambient glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-125 w-125 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-600/15" />
      </div>

      {/* Glass Timer Container */}
      <div className="
        relative flex h-80 w-80 items-center justify-center rounded-full
        border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.15)]
        backdrop-blur-2xl transition-all duration-500 sm:h-105 sm:w-105
        dark:border-white/10 dark:bg-zinc-900/60
      ">
        {/* Subtle rotating gradient ring */}
        <div className="
          animate-spin-slow absolute inset-0 rounded-full
          bg-linear-to-tr from-indigo-500/20 via-teal-400/10 to-indigo-500/20
          opacity-60 blur-2xl dark:from-indigo-600/20 dark:via-teal-500/10 dark:to-indigo-600/20
        " />

        {/* Inner circle */}
        <div className="
          relative flex h-[70%] w-[70%] flex-col items-center justify-center
          rounded-full bg-white/40 shadow-inner backdrop-blur-xl
          dark:bg-zinc-900/60
        ">
          <div className="
            font-mono text-6xl font-medium tracking-tight text-zinc-600
            transition-all duration-300 sm:text-8xl
            dark:text-zinc-300
          ">
            {formatTime(seconds)}
          </div>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {mode === "hyper" ? "Hyperfocus Mode" : "Scatterfocus Mode"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-16 flex flex-col items-center gap-6">
        {!running && !completed && (
          <Button
            onClick={startSession}
            disabled={loadingStart}
            size="lg"
            className="
              h-16 min-w-65 rounded-full
              bg-linear-to-r from-indigo-600 to-teal-600
              text-lg font-semibold text-white shadow-xl
              transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl
              dark:from-indigo-500 dark:to-teal-500
              dark:hover:from-indigo-600 dark:hover:to-teal-600
            "
          >
            {loadingStart ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Focus"
            )}
          </Button>
        )}

        {running && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={pauseSession}
              className="
                h-16 min-w-48 rounded-full border-white/30 text-lg
                backdrop-blur-md dark:border-white/20
              "
            >
              Pause Session
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={resumeSession}
              className="h-16 min-w-48 rounded-full text-lg"
            >
              Resume
            </Button>
          </div>
        )}

        {completed && (
          <div className="space-y-8 text-center">
            <RewardConfetti />
            <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
              Session Completed ✨
            </p>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="rounded-full text-indigo-600 dark:text-indigo-400"
            >
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
