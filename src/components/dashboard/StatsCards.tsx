"use client";

import { Card } from "@/components/ui/Card";
import { Users, Flame, Sun, Snowflake } from "lucide-react";

interface StatsCardsProps {
  total: number;
  hot: number;
  warm: number;
  cold: number;
}

const stats = [
  { key: "total" as const, label: "Total Leads", icon: Users, color: "text-blue-600 bg-blue-50" },
  { key: "hot" as const, label: "Hot", icon: Flame, color: "text-red-600 bg-red-50" },
  { key: "warm" as const, label: "Warm", icon: Sun, color: "text-amber-600 bg-amber-50" },
  { key: "cold" as const, label: "Cold", icon: Snowflake, color: "text-sky-600 bg-sky-50" },
];

export function StatsCards({ total, hot, warm, cold }: StatsCardsProps) {
  const values = { total, hot, warm, cold };

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card key={stat.key} className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
          >
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{values[stat.key]}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
