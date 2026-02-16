"use client";

import { useLeadStats } from "@/hooks/useLeadStats";
import { StatusChart } from "@/components/analytics/StatusChart";
import { InterestChart } from "@/components/analytics/InterestChart";
import { PropertyTypeChart } from "@/components/analytics/PropertyTypeChart";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function AnalyticsPage() {
  const { stats, loading } = useLeadStats();

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="px-4 py-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Analytics</h2>

      {stats.total === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">
            Add leads to see analytics
          </p>
        </div>
      ) : (
        <>
          <Card>
            <StatusChart data={stats.byStatus} />
          </Card>
          <Card>
            <InterestChart data={stats.byInterest} />
          </Card>
          <Card>
            <PropertyTypeChart data={stats.byPropertyType} />
          </Card>
        </>
      )}
    </div>
  );
}
