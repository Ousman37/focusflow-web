// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------ */
/* Validation Schema  */
/* ------------------ */

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, data.email);

      toast.success(
        "Reset link sent! Check your email (including spam folder)."
      );

      // Optional: redirect to login after a few seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 4000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="
        w-full max-w-lg border-border bg-card shadow-xl
        transition-all duration-300 hover:shadow-2xl
      ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">
            Reset your password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we'll send you a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={cn(
                  "bg-background",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="
                w-full bg-linear-to-r from-indigo-600 to-teal-600
                text-white shadow-lg transition-all duration-300
                hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700
                hover:shadow-xl active:scale-[0.98]
                dark:from-indigo-500 dark:to-teal-500
                dark:hover:from-indigo-600 dark:hover:to-teal-600
              "
              disabled={loading}
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="ml-1 text-primary hover:underline"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
