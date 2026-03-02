// src/components/subscription/Subscription.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

export default function Subscription() {
  const {
    plan,
    status,
    currentPeriodEnd,
    isActive,
    loading,
    upgradePlan,
    cancelSubscription,
  } = useSubscription();

  const getPlanName = () => {
    switch (plan) {
      case "PREMIUM_MONTHLY":
        return "Premium Monthly";
      case "PREMIUM_YEARLY":
        return "Premium Yearly";
      default:
        return "Free";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "ACTIVE":
      case "TRIALING":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-600">
            Active
          </Badge>
        );
      case "PAST_DUE":
        return <Badge variant="destructive">Past Due</Badge>;
      case "CANCELED":
        return <Badge variant="secondary">Canceled</Badge>;
      case "INCOMPLETE":
      case "UNPAID":
        return <Badge variant="secondary">Incomplete</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleUpgrade = async (
    newPlan: "PREMIUM_MONTHLY" | "PREMIUM_YEARLY"
  ) => {
    await upgradePlan(newPlan);
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    await cancelSubscription();
  };

  if (loading) {
    return (
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Your Subscription</CardTitle>
            <CardDescription className="mt-1">
              Manage your plan and billing
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Current Plan
            </p>
            <p className="mt-1 text-xl font-semibold">{getPlanName()}</p>
          </div>
          {currentPeriodEnd && (
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Renews / Ends
              </p>
              <p className="mt-1 text-base">
                {new Date(currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {plan === "FREE" ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You're on the free plan. Upgrade to unlock unlimited sessions,
              advanced analytics, and more.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => handleUpgrade("PREMIUM_MONTHLY")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Upgrade Monthly
              </Button>
              <Button
                onClick={() => handleUpgrade("PREMIUM_YEARLY")}
                variant="outline"
                className="flex-1"
              >
                Upgrade Yearly (Save 20%)
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Premium benefits active</span>
            </div>

            <Button
              variant="destructive"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
