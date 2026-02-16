"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLeadStats } from "@/hooks/useLeadStats";
import { useFollowUps } from "@/hooks/useFollowUps";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TodayFollowUps } from "@/components/dashboard/TodayFollowUps";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { Spinner } from "@/components/ui/Spinner";
import { ChevronRight, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { stats, leads, loading } = useLeadStats();
  const { overdue, today } = useFollowUps();

  const recentLeads = useMemo(() => leads.slice(0, 5), [leads]);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="px-4 py-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

      <StatsCards
        total={stats.total}
        hot={stats.hot}
        warm={stats.warm}
        cold={stats.cold}
      />

      {overdue.length > 0 && (
        <Link
          href="/follow-ups"
          className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          <AlertCircle className="h-4 w-4" />
          {overdue.length} overdue follow-up{overdue.length > 1 ? "s" : ""}
          <ChevronRight className="ml-auto h-4 w-4" />
        </Link>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Today&apos;s Follow-ups ({today.length})
          </h3>
          <Link
            href="/follow-ups"
            className="text-xs font-medium text-blue-600"
          >
            View all
          </Link>
        </div>
        <TodayFollowUps leads={today} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Leads</h3>
          <Link href="/leads" className="text-xs font-medium text-blue-600">
            View all
          </Link>
        </div>
        <RecentLeads leads={recentLeads} />
      </div>
    </div>
  );
}
