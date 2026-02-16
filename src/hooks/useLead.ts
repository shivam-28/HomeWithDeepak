"use client";

import { useEffect, useState } from "react";
import { getLead } from "@/lib/firebase/firestore";
import { Lead } from "@/types";

export function useLead(leadId: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLead(leadId).then((lead) => {
      if (!cancelled) {
        setLead(lead);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const refetch = async () => {
    setLoading(true);
    const lead = await getLead(leadId);
    setLead(lead);
    setLoading(false);
  };

  return { lead, loading, refetch };
}
