// src/components/progress/FocusBarChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type DayData = { day: string; minutes: number };

export default function FocusBarChart({ data }: { data: DayData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: "#a1a1aa" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#a1a1aa" }}
          axisLine={false}
          tickLine={false}
          unit=" min"
        />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: 8,
            color: "#f4f4f5",
          }}
          formatter={(v: number) => [`${v} min`, "Focus time"]}
        />
        <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.minutes > 0 ? "#6366f1" : "#3f3f46"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
