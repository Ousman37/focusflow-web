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

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData(e.currentTarget);
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      const cred = await signInWithEmailAndPassword(auth, email, password);

      const res = await fetch("/api/auth/sync", {
        method: "POST",
        credentials: "include", // 🔥 IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: cred.user.uid,
          email: cred.user.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync user");
      }

      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/sync", {
        method: "POST",
        credentials: "include", // 🔥 IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: cred.user.uid,
          email: cred.user.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync user");
      }

      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-background pr-10"
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
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
            disabled={loading}
          >
            Continue with Google
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



// "use client";

// import { useState } from "react";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const form = new FormData(e.currentTarget);
//       const email = form.get("email") as string;
//       const password = form.get("password") as string;

//       const cred = await signInWithEmailAndPassword(auth, email, password);

//       const res = await fetch("/api/auth/sync", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firebaseUid: cred.user.uid,
//           email: cred.user.email,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to sync user");
//       }

//       router.replace("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);

//       const provider = new GoogleAuthProvider();
//       const cred = await signInWithPopup(auth, provider);

//       const res = await fetch("/api/auth/sync", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firebaseUid: cred.user.uid,
//           email: cred.user.email,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to sync user");
//       }

//       router.replace("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message || "Google login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
//       <Card className="
//         w-full max-w-lg border-border bg-card shadow-xl
//         transition-all duration-300 hover:shadow-2xl
//       ">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-foreground">
//             Welcome back
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Login to continue your focus journey
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <form onSubmit={handleEmailLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-foreground">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="bg-background"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-foreground">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   required
//                   className="bg-background pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </Button>
//               </div>
//               <div className="text-right text-xs">
//                 <Link href="/auth/forgot-password" className="text-primary hover:underline">
//                   Forgot password?
//                 </Link>
//               </div>
//             </div>

//             <Button
//               className="
//                 w-full bg-linear-to-r from-indigo-600 to-teal-600
//                 text-white shadow-lg transition-all duration-300
//                 hover:scale-[1.02] hover:from-indigo-700 hover:to-teal-700
//                 hover:shadow-xl active:scale-[0.98]
//                 dark:from-indigo-500 dark:to-teal-500
//                 dark:hover:from-indigo-600 dark:hover:to-teal-600
//               "
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-border" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-card px-2 text-muted-foreground">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           <Button
//             variant="outline"
//             className="
//               w-full border-border hover:bg-accent/70
//               transition-colors
//             "
//             onClick={handleGoogleLogin}
//             disabled={loading}
//           >
//             Continue with Google
//           </Button>
//         </CardContent>

//         <CardFooter className="flex justify-center text-sm text-muted-foreground">
//           New here?{" "}
//           <Link href="/auth/signup" className="ml-1 text-primary hover:underline">
//             Create account
//           </Link>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
