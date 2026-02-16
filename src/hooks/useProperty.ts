"use client";

import { useEffect, useState } from "react";
import { getProperty } from "@/lib/firebase/inventory";
import { Property } from "@/types";

export function useProperty(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProperty(propertyId).then((property) => {
      if (!cancelled) {
        setProperty(property);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const refetch = async () => {
    setLoading(true);
    const property = await getProperty(propertyId);
    setProperty(property);
    setLoading(false);
  };

  return { property, loading, refetch };
}
