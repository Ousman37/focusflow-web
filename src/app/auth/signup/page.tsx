//src/app/auth/signup/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";

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

/* ------------------ */
/* Validation Schema  */
/* ------------------ */

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const res = await fetch("/api/auth/sync", {
        method: "POST",
        credentials: "include", // 🔥 IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: cred.user.uid,
          email: cred.user.email,
          name: data.name,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to sync user");
      }

      toast.success("Account created! Welcome to FocusFlow");

      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code) ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
          name: cred.user.displayName,
          avatarUrl: cred.user.photoURL,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to sync user");
      }

      toast.success("Welcome to FocusFlow");

      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code) ?? error.message);
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
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Start mastering your attention today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(onSubmit)(e); }} className="space-y-6">
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={cn(
                    "bg-background",
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={cn(
                    "bg-background",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={cn(
                      "bg-background pr-10",
                      errors.password &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
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
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={cn(
                      "bg-background pr-10",
                      errors.confirmPassword &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-6">
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
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="ml-1 text-primary hover:underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}




// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast } from "sonner";
// import {
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { cn } from "@/lib/utils";

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

// /* ------------------ */
// /* Validation Schema  */
// /* ------------------ */

// const formSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// type FormValues = z.infer<typeof formSchema>;

// export default function SignupPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = async (data: FormValues) => {
//     try {
//       setLoading(true);

//       const cred = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       await fetch("/api/auth/sync", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firebaseUid: cred.user.uid,
//           email: cred.user.email,
//         }),
//       });

//       toast.success("Account created! Welcome to FocusFlow 🎉");

//       router.push("/dashboard");
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignup = async () => {
//     try {
//       setLoading(true);

//       const provider = new GoogleAuthProvider();
//       const cred = await signInWithPopup(auth, provider);

//       await fetch("/api/auth/sync", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firebaseUid: cred.user.uid,
//           email: cred.user.email,
//         }),
//       });

//       toast.success("Welcome to FocusFlow 🎉");

//       router.push("/dashboard");
//     } catch (error: any) {
//       toast.error(error.message || "Google signup failed");
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
//             Create your account
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Start mastering your attention today
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="space-y-5">
//               <div className="grid gap-2">
//                 <Label htmlFor="name" className="text-foreground">
//                   Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   {...register("name")}
//                   className={cn(
//                     "bg-background",
//                     errors.name && "border-destructive focus-visible:ring-destructive"
//                   )}
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-destructive">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="email" className="text-foreground">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   className={cn(
//                     "bg-background",
//                     errors.email && "border-destructive focus-visible:ring-destructive"
//                   )}
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-destructive">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="password" className="text-foreground">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     {...register("password")}
//                     className={cn(
//                       "bg-background pr-10",
//                       errors.password && "border-destructive focus-visible:ring-destructive"
//                     )}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-destructive">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="confirm-password" className="text-foreground">
//                   Confirm Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="confirm-password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     {...register("confirmPassword")}
//                     className={cn(
//                       "bg-background pr-10",
//                       errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
//                     )}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-destructive">
//                     {errors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <Button
//               type="submit"
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
//               {loading ? "Creating account..." : "Sign Up"}
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-6">
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
//             type="button"
//             onClick={handleGoogleSignup}
//             disabled={loading}
//           >
//             Continue with Google
//           </Button>
//         </CardContent>

//         <CardFooter className="flex justify-center text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <Link href="/auth/login"
//             className="ml-1 text-primary hover:underline"
//           >
//             Log in
//           </Link>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
