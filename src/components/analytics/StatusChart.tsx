"use client";

import { BarChart } from "./BarChart";
import { LeadStatus } from "@/types";
import { LEAD_STATUSES } from "@/lib/utils/constants";

const statusBarColors: Record<LeadStatus, string> = {
  New: "bg-blue-500",
  "In Progress": "bg-yellow-500",
  Visited: "bg-purple-500",
  Negotiation: "bg-orange-500",
  "Closed Won": "bg-green-500",
  "Closed Lost": "bg-red-500",
};

interface StatusChartProps {
  data: Record<LeadStatus, number>;
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = LEAD_STATUSES.map((s) => ({
    label: s,
    value: data[s],
    color: statusBarColors[s],
  }));

  return <BarChart title="Leads by Status" data={chartData} />;
}
