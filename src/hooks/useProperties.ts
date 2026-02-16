"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeToProperties, subscribeToAllProperties } from "@/lib/firebase/inventory";
import { Property } from "@/types";

export function useProperties() {
  const { user, isAdmin } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const onProperties = (properties: Property[]) => {
      setProperties(properties);
      setLoading(false);
    };
    const unsubscribe = isAdmin
      ? subscribeToAllProperties(onProperties)
      : subscribeToProperties(user.uid, onProperties);
    return unsubscribe;
  }, [user, isAdmin]);

  return { properties, loading };
}
