"use client";

import { useFollowUps } from "@/hooks/useFollowUps";
import { FollowUpList } from "@/components/follow-ups/FollowUpList";
import { Spinner } from "@/components/ui/Spinner";

export default function FollowUpsPage() {
  const { overdue, today, upcoming, loading } = useFollowUps();

  // We need a way to trigger refetch. Since useLeads uses onSnapshot,
  // updates happen automatically in real-time. onUpdate is a no-op here.
  const onUpdate = () => {};

  if (loading) return <Spinner className="py-20" />;

  const hasAny = overdue.length + today.length + upcoming.length > 0;

  return (
    <div className="px-4 py-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Follow-ups</h2>

      {!hasAny ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">No scheduled follow-ups</p>
        </div>
      ) : (
        <>
          <FollowUpList
            title="Overdue"
            leads={overdue}
            variant="overdue"
            onUpdate={onUpdate}
          />
          <FollowUpList
            title="Today"
            leads={today}
            variant="today"
            onUpdate={onUpdate}
          />
          <FollowUpList
            title="Upcoming (7 days)"
            leads={upcoming}
            variant="upcoming"
            onUpdate={onUpdate}
          />
        </>
      )}
    </div>
  );
}
