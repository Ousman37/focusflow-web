"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [teamFocus, setTeamFocus] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: "Ethan Dev",
      avatarUrl: "",
    });
  }, [reset]);

  const onSubmitProfile = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated");
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    if (!confirm("Are you sure?")) return;
    toast.info("Account deletion requested");
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* ================= HEADER ================= */}
        <div className="space-y-6">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">
              Settings
            </h1>
            <p className="text-muted-foreground mt-3">
              Manage your account, preferences and focus experience.
            </p>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-muted grid w-full grid-cols-4 rounded-xl p-1">
            <TabsTrigger value="profile">Account</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="danger">Danger</TabsTrigger>
          </TabsList>

          {/* ================= PROFILE ================= */}
          <TabsContent value="profile">
            <Card className="bg-card/60 border-border rounded-3xl border shadow-sm backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your name and personalize your avatar.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmitProfile)}
                  className="space-y-10"
                >
                  {/* ================= AVATAR ================= */}

                  <AvatarUploader
                    value={form.watch("avatarUrl") || undefined}
                    fallback={
                      form.watch("name")?.charAt(0).toUpperCase() || "U"
                    }
                    onChange={(val: string) => form.setValue("avatarUrl", val)}
                  />

                  {/* ================= NAME ================= */}
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...register("name")} />
                    {errors.name && (
                      <p className="text-destructive text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground hover:opacity-90"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= FOCUS ================= */}
          <TabsContent value="focus">
            <Card className="bg-card border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-indigo-700 dark:text-indigo-400">
                  Focus Preferences
                </CardTitle>
                <CardDescription>
                  Customize how you focus and collaborate.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Timer */}
                <div className="space-y-2">
                  <Label>Default Timer Length (minutes)</Label>
                  <Input type="number" defaultValue={25} className="w-32" />
                </div>

                {/* Notifications */}
                <div className="bg-muted flex items-center justify-between rounded-xl px-5 py-4">
                  <span className="font-medium dark:text-slate-200">
                    Enable Session End Notifications
                  </span>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className={cn(
                      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-300",
                      "dark:data-[state=checked]:bg-indigo-500 dark:data-[state=unchecked]:bg-slate-600",
                      "[&_span]:h-5 [&_span]:w-5 [&_span]:rounded-full [&_span]:bg-white [&_span]:shadow-lg",
                      "[&_span]:data-[state=checked]:translate-x-5 [&_span]:data-[state=unchecked]:translate-x-0",
                      "[&_span]:transition-transform [&_span]:duration-200"
                    )}
                  />
                </div>

                {/* TEAM FOCUS */}
                <div className="bg-primary/10 rounded-2xl p-6 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-indigo-700 dark:text-indigo-400">
                        Team Focus Mode
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Join shared focus sessions with friends or teammates.
                      </p>
                    </div>

                    <Switch
                      checked={teamFocus}
                      onCheckedChange={setTeamFocus}
                      className={cn(
                        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-300",
                        "dark:data-[state=checked]:bg-indigo-500 dark:data-[state=unchecked]:bg-slate-600",
                        "[&_span]:h-5 [&_span]:w-5 [&_span]:rounded-full [&_span]:bg-white [&_span]:shadow-lg",
                        "[&_span]:data-[state=checked]:translate-x-5 [&_span]:data-[state=unchecked]:translate-x-0",
                        "[&_span]:transition-transform [&_span]:duration-200"
                      )}
                    />
                  </div>

                  {teamFocus && (
                    <div className="mt-5">
                      <Button className="bg-primary text-primary-foreground hover:opacity-90">
                        Create Team Session
                      </Button>
                    </div>
                  )}
                </div>

                {/* Theme */}
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-slate-200">Theme</span>
                  <div className="flex gap-2">
                    {["light", "dark", "system"].map((t) => {
                      const active = theme === t;

                      return (
                        <Button
                          key={t}
                          size="sm"
                          onClick={() => setTheme(t)}
                          className={cn(
                            active
                              ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          )}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= BILLING ================= */}
          <TabsContent value="billing">
            <Card className="bg-card border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sky-700 dark:text-sky-400">
                  Billing & Subscription
                </CardTitle>
                <CardDescription>Manage your subscription.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stripe integration coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= DANGER ================= */}
          <TabsContent value="danger">
            <Card className="bg-destructive/10 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
