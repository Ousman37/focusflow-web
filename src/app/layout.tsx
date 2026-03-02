import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import GlobalFooter from "@/components/layout/GlobalFooter";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),

  title: {
    default: "FocusFlow | Master Your Attention",
    template: "%s – FocusFlow",
  },

  description:
    "Hyperfocus & Scatterfocus – Work less, achieve more. Productivity app inspired by Chris Bailey.",

  keywords: [
    "productivity",
    "focus",
    "hyperfocus",
    "deep work",
    "attention management",
  ],

  authors: [{ name: "Ethmane Didi", url: "https://x.com/Ethamne_dev" }],
  creator: "Ethan @Ethamne_dev",

  openGraph: {
    title: "FocusFlow",
    description:
      "Master your attention with Hyperfocus and Scatterfocus modes. Work smarter, not harder.",
    url: "/",
    siteName: "FocusFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FocusFlow – Productivity App",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FocusFlow",
    description: "Hyperfocus & Scatterfocus productivity tool",
    creator: "@Ethamne_dev",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          {children}
          <Toaster richColors position="top-right" />
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
