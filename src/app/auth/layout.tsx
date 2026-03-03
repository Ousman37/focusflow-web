// src/app/(auth)/layout.tsx
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
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
