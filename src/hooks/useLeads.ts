"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeToLeads, subscribeToAllLeads } from "@/lib/firebase/firestore";
import { Lead } from "@/types";

export function useLeads() {
  const { user, isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const onLeads = (leads: Lead[]) => {
      setLeads(leads);
      setLoading(false);
    };
    const unsubscribe = isAdmin
      ? subscribeToAllLeads(onLeads)
      : subscribeToLeads(user.uid, onLeads);
    return unsubscribe;
  }, [user, isAdmin]);

  return { leads, loading };
}
