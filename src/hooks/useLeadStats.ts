"use client";

import { useMemo } from "react";
import { useLeads } from "./useLeads";
import { Lead, LeadStatus, InterestLevel, PropertyType } from "@/types";
import { LEAD_STATUSES, INTEREST_LEVELS, PROPERTY_TYPES } from "@/lib/utils/constants";

export function useLeadStats() {
  const { leads, loading } = useLeads();

  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.customer_interest === "Hot").length;
    const warm = leads.filter((l) => l.customer_interest === "Warm").length;
    const cold = leads.filter((l) => l.customer_interest === "Cold").length;

    const byStatus: Record<LeadStatus, number> = {} as Record<LeadStatus, number>;
    for (const s of LEAD_STATUSES) byStatus[s] = 0;
    for (const l of leads) byStatus[l.status]++;

    const byInterest: Record<InterestLevel, number> = {} as Record<InterestLevel, number>;
    for (const i of INTEREST_LEVELS) byInterest[i] = 0;
    for (const l of leads) byInterest[l.customer_interest]++;

    const byPropertyType: Record<PropertyType, number> = {} as Record<PropertyType, number>;
    for (const p of PROPERTY_TYPES) byPropertyType[p] = 0;
    for (const l of leads) byPropertyType[l.property_type]++;

    return { total, hot, warm, cold, byStatus, byInterest, byPropertyType };
  }, [leads]);

  return { stats, leads, loading };
}
