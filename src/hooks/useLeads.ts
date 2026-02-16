"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeToLeads } from "@/lib/firebase/firestore";
import { Lead } from "@/types";

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToLeads(user.uid, (leads) => {
      setLeads(leads);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { leads, loading };
}
