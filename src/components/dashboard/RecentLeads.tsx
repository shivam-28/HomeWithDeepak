"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { InterestBadge } from "@/components/leads/InterestBadge";
import { Lead } from "@/types";
import { formatRelative } from "@/lib/utils/dates";
import { ChevronRight } from "lucide-react";

interface RecentLeadsProps {
  leads: Lead[];
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const router = useRouter();

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-400">No leads yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leads.map((lead) => (
        <Card
          key={lead.id}
          onClick={() => router.push(`/leads/${lead.id}`)}
          className="flex items-center justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 truncate">
                {lead.customer_name}
              </p>
              <InterestBadge interest={lead.customer_interest} />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={lead.status} />
              <span className="text-xs text-gray-400">
                {formatRelative(lead.created_at)}
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 ml-2" />
        </Card>
      ))}
    </div>
  );
}
