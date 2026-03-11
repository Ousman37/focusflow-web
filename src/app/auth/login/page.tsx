//src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
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
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginValues = z.infer<typeof loginSchema>;

async function syncSession(uid: string, email: string, name?: string | null, avatarUrl?: string | null) {
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebaseUid: uid, email, name, avatarUrl }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Failed to sync session");
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleEmailLogin = async (data: LoginValues) => {
    try {
      setEmailLoading(true);
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password);
      await syncSession(cred.user.uid, cred.user.email!);
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(getFirebaseErrorMessage(err.code) ?? err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await syncSession(cred.user.uid, cred.user.email!, cred.user.displayName, cred.user.photoURL);
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(getFirebaseErrorMessage(err.code) ?? err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoading = emailLoading || googleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card
        className="
        w-full max-w-lg border-border bg-card shadow-xl
        transition-all duration-300 hover:shadow-2xl
      "
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Login to continue your focus journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(handleEmailLogin)(e); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={cn("bg-background", errors.email && "border-destructive")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={cn("bg-background pr-10", errors.password && "border-destructive")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="text-right text-xs">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              className="
                w-full bg-linear-to-r from-indigo-600 to-teal-600
                text-white shadow-lg transition-all duration-300
                hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700
                hover:shadow-xl active:scale-[0.98]
                dark:from-indigo-500 dark:to-teal-500
                dark:hover:from-indigo-600 dark:hover:to-teal-600
              "
              disabled={isLoading}
            >
              {emailLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-border hover:bg-accent/70 transition-colors"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href="/auth/signup"
            className="ml-1 text-primary hover:underline"
          >
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}




