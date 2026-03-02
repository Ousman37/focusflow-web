// src/hooks/useRewards.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Badge = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  imageUrl?: string;
};

type RewardState = {
  points: number;
  badges: Badge[];
  loading: boolean;
  error: string | null;
};

export function useRewards() {
  const [state, setState] = useState<RewardState>({
    points: 0,
    badges: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch("/api/rewards");
        if (!res.ok) throw new Error("Failed to fetch rewards");

        const data = await res.json();
        setState({
          points: data.points || 0,
          badges: data.badges || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        toast.error("Failed to load rewards");
      }
    };

    fetchRewards();
  }, []);

  const claimReward = async (rewardId: string) => {
    try {
      const res = await fetch("/api/rewards/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      if (!res.ok) throw new Error("Failed to claim reward");

      const data = await res.json();

      setState((prev) => ({
        ...prev,
        points: prev.points - (data.cost || 0),
        badges: prev.badges.map((b) =>
          b.id === rewardId ? { ...b, unlocked: true } : b
        ),
      }));

      toast.success("Reward claimed!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    }
  };

  return {
    ...state,
    claimReward,
  };
}
