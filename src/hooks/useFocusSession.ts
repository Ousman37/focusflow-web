// src/hooks/useFocusSession.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type FocusMode = "hyper" | "scatter";

type SessionState = {
  sessionId: string | null;
  mode: FocusMode;
  secondsLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  loading: boolean;
  error: string | null;
};

const DEFAULT_DURATION = 25 * 60; // 25 minutes

export function useFocusSession(initialMode: FocusMode = "hyper") {
  const [state, setState] = useState<SessionState>({
    sessionId: null,
    mode: initialMode,
    secondsLeft: DEFAULT_DURATION,
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    loading: false,
    error: null,
  });

  // Timer countdown logic
  useEffect(() => {
    if (!state.isRunning || state.isPaused || state.isCompleted) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.secondsLeft <= 1) {
          clearInterval(interval);
          completeSession();
          return {
            ...prev,
            secondsLeft: 0,
            isRunning: false,
            isCompleted: true,
          };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, state.isCompleted]);

  const startSession = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: state.mode, duration: DEFAULT_DURATION }),
      });

      if (!res.ok) throw new Error("Failed to start session");

      const data = await res.json();

      setState({
        sessionId: data.sessionId,
        mode: state.mode,
        secondsLeft: DEFAULT_DURATION,
        isRunning: true,
        isPaused: false,
        isCompleted: false,
        loading: false,
        error: null,
      });

      toast.success("Session started");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      toast.error(message);
    }
  }, [state.mode]);

  const pauseSession = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false, isPaused: true }));
    toast.info("Session paused");
  }, []);

  const resumeSession = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    toast.info("Session resumed");
  }, []);

  const completeSession = useCallback(async () => {
    if (!state.sessionId) return;

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch("/api/sessions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId }),
      });

      if (!res.ok) throw new Error("Failed to complete session");

      setState((prev) => ({
        ...prev,
        isRunning: false,
        isPaused: false,
        isCompleted: true,
        loading: false,
      }));

      toast.success("Session completed! Great job 🎉");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      toast.error(message);
    }
  }, [state.sessionId]);

  const resetSession = useCallback(() => {
    setState({
      sessionId: null,
      mode: initialMode,
      secondsLeft: DEFAULT_DURATION,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      loading: false,
      error: null,
    });
  }, [initialMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    ...state,
    formattedTime: formatTime(state.secondsLeft),
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    resetSession,
  };
}
