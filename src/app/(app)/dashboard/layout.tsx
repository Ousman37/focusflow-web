// src/app/(app)/dashboard/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { getServerSessionUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        <DashboardSidebar /> {/* ← remove user=... */}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={user} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
