"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User, Sun, Moon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Props = {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
  };
};

export default function DashboardHeader({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch("/api/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/focus/hyper")) return "Hyperfocus Mode";
    if (pathname.startsWith("/focus/scatter")) return "Scatterfocus Mode";
    if (pathname.startsWith("/rituals")) return "Daily Rituals";
    if (pathname.startsWith("/progress")) return "Progress & Insights";
    if (pathname.startsWith("/rewards")) return "Rewards";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/profile")) return "Profile";
    return "FocusFlow";
  };

  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 w-full border-b shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Page Title */}
        <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
          {getTitle()}
        </h2>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "relative h-9 w-9 rounded-full transition-all duration-200",
              "hover:bg-accent/70 hover:scale-105 hover:shadow-sm",
              mounted
                ? theme === "dark"
                  ? "bg-amber-950/30 text-amber-400 hover:text-amber-300"
                  : "bg-indigo-100/50 text-indigo-600 hover:text-indigo-700"
                : "text-muted-foreground bg-muted/50"
            )}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5 opacity-0" /> // invisible placeholder to prevent layout shift
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-9 w-9 rounded-full transition-all duration-200",
              "hover:bg-accent/70 hover:scale-105 hover:shadow-sm",
              mounted
                ? theme === "dark"
                  ? "text-indigo-300 hover:text-indigo-200"
                  : "text-indigo-600 hover:text-indigo-700"
                : "text-muted-foreground bg-muted/50"
            )}
          >
            <Bell className="h-5 w-5" />
            {/* Optional: add a small badge if you have unread notifications */}
            {/* <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" /> */}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-10 w-10 rounded-full p-0 transition-all duration-200",
                  "hover:bg-accent/70 hover:ring-primary/30 hover:scale-105 hover:shadow-sm hover:ring-2"
                )}
              >
                <Avatar className="border-primary/20 h-10 w-10 border-2">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                      {avatarLetter}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-popover border-border w-56 border shadow-xl"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-foreground text-sm font-medium">
                    {displayName}
                  </p>
                  {user.email && (
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
