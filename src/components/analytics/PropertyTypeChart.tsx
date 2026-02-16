"use client";

import { BarChart } from "./BarChart";
import { PropertyType } from "@/types";
import { PROPERTY_TYPES } from "@/lib/utils/constants";

const propertyBarColors: Record<PropertyType, string> = {
  Apartment: "bg-indigo-500",
  Villa: "bg-emerald-500",
  Plot: "bg-lime-500",
  Commercial: "bg-violet-500",
  Penthouse: "bg-pink-500",
  Studio: "bg-teal-500",
  Other: "bg-gray-500",
};

interface PropertyTypeChartProps {
  data: Record<PropertyType, number>;
}

export function PropertyTypeChart({ data }: PropertyTypeChartProps) {
  const chartData = PROPERTY_TYPES.map((p) => ({
    label: p,
    value: data[p],
    color: propertyBarColors[p],
  }));

  return <BarChart title="Leads by Property Type" data={chartData} />;
}
