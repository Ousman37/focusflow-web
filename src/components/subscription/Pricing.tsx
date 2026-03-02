// src/components/subscription/Pricing.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    features: [
      "Limited daily sessions",
      "Basic focus modes",
      "No analytics",
      "No badges",
    ],
    cta: "Current Plan",
    variant: "outline" as const,
    disabled: true,
  },
  {
    name: "Premium Monthly",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited sessions",
      "Advanced analytics & progress",
      "Full badge system & rewards",
      "Priority support",
    ],
    cta: "Upgrade",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Premium Yearly",
    price: "$99",
    interval: "year",
    features: [
      "Save 17% vs monthly",
      "All Premium Monthly features",
      "Exclusive yearly badges",
      "Early access to new features",
    ],
    cta: "Upgrade & Save",
    variant: "default" as const,
  },
];

export default function Pricing() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "relative flex flex-col border-zinc-200 dark:border-zinc-800",
            plan.popular &&
              "scale-[1.02] border-indigo-600 shadow-xl dark:border-indigo-500"
          )}
        >
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-600">
              Most Popular
            </Badge>
          )}

          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground"> / {plan.interval}</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              variant={plan.variant}
              className="w-full"
              disabled={plan.disabled}
            >
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
