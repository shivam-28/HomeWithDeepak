"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { FullPageSpinner } from "@/components/ui/Spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <FullPageSpinner />;
  if (!user) return <FullPageSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pb-20 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
