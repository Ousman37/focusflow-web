// src/hooks/useSubscription.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";

type SubscriptionPlan = "FREE" | "PREMIUM_MONTHLY" | "PREMIUM_YEARLY";
type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"
  | "TRIALING"
  | "UNPAID";

type SubscriptionState = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
};

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    plan: "FREE",
    status: "ACTIVE",
    currentPeriodEnd: null,
    isActive: true,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscription");
        if (!res.ok) throw new Error("Failed to fetch subscription");

        const data = await res.json();

        setState({
          plan: data.plan || "FREE",
          status: data.status || "ACTIVE",
          currentPeriodEnd: data.currentPeriodEnd || null,
          isActive: data.status === "ACTIVE" || data.status === "TRIALING",
          loading: false,
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        toast.error("Failed to load subscription status");
      }
    };

    fetchSubscription();
  }, []);

  const upgradePlan = async (newPlan: SubscriptionPlan) => {
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });

      if (!res.ok) throw new Error("Failed to upgrade plan");

      const data = await res.json();

      setState((prev) => ({
        ...prev,
        plan: data.plan,
        status: data.status,
        currentPeriodEnd: data.currentPeriodEnd,
        isActive: true,
      }));

      toast.success(`Upgraded to ${newPlan}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    }
  };

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      if (!res.ok) throw new Error("Failed to cancel subscription");

      setState((prev) => ({
        ...prev,
        status: "CANCELED",
        isActive: false,
      }));

      toast.success("Subscription canceled. You can resubscribe anytime.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    }
  };

  return {
    ...state,
    upgradePlan,
    cancelSubscription,
  };
}
