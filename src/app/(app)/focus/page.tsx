import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, BookOpen } from "lucide-react";

export default function FocusPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Choose Your Focus Mode
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Enter deep work or spark creativity. Your attention, your choice.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hyperfocus */}
        <Card className="border shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-indigo-600" />
              <CardTitle>Hyperfocus</CardTitle>
            </div>
            <CardDescription>
              Deep work mode. Eliminate distractions and execute one task with
              full attention.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/focus/hyper">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Enter Hyperfocus
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Scatterfocus */}
        <Card className="border shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-teal-600" />
              <CardTitle>Scatterfocus</CardTitle>
            </div>
            <CardDescription>
              Creative mode. Let your mind wander and generate ideas without
              pressure.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/focus/scatter">
              <Button variant="outline" className="w-full">
                Enter Scatterfocus
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Optional CTA */}
      <div className="pt-6 text-center">
        <Link href="/focus/timer">
          <Button variant="ghost">Quick Start 25-Minute Deep Work →</Button>
        </Link>
      </div>
    </div>
  );
}
