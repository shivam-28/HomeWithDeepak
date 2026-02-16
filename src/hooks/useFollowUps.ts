"use client";

import { useMemo } from "react";
import { useLeads } from "./useLeads";
import { Lead } from "@/types";
import { isOverdue, isTodayDate, isUpcoming } from "@/lib/utils/dates";

export function useFollowUps() {
  const { leads, loading } = useLeads();

  const { overdue, today, upcoming } = useMemo(() => {
    const withFollowUp = leads.filter((l) => l.follow_up_call !== null);

    const overdue: Lead[] = [];
    const today: Lead[] = [];
    const upcoming: Lead[] = [];

    for (const lead of withFollowUp) {
      if (isOverdue(lead.follow_up_call)) {
        overdue.push(lead);
      } else if (isTodayDate(lead.follow_up_call)) {
        today.push(lead);
      } else if (isUpcoming(lead.follow_up_call)) {
        upcoming.push(lead);
      }
    }

    return { overdue, today, upcoming };
  }, [leads]);

  return { overdue, today, upcoming, loading };
}
