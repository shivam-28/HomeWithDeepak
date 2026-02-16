"use client";

import { createContext, useEffect, useState, useMemo, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/config";
import { isAdmin as checkAdmin } from "@/lib/utils/admin";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = useMemo(() => checkAdmin(user?.email), [user?.email]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
