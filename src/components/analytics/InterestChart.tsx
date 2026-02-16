"use client";

import { BarChart } from "./BarChart";
import { InterestLevel } from "@/types";
import { INTEREST_LEVELS } from "@/lib/utils/constants";

const interestBarColors: Record<InterestLevel, string> = {
  Hot: "bg-red-500",
  Warm: "bg-amber-500",
  Cold: "bg-sky-500",
};

interface InterestChartProps {
  data: Record<InterestLevel, number>;
}

export function InterestChart({ data }: InterestChartProps) {
  const chartData = INTEREST_LEVELS.map((i) => ({
    label: i,
    value: data[i],
    color: interestBarColors[i],
  }));

  return <BarChart title="Leads by Interest" data={chartData} />;
}
