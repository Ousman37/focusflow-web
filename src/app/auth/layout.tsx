// src/app/auth/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSessionUser } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getServerSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="
      relative flex min-h-screen flex-col
      bg-linear-to-br from-background via-background/95 to-background/90
      px-4 py-12
    ">
      {children}
    </div>
  );
}
