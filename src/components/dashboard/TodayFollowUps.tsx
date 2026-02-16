"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Lead } from "@/types";
import { Phone, ChevronRight } from "lucide-react";

interface TodayFollowUpsProps {
  leads: Lead[];
}

export function TodayFollowUps({ leads }: TodayFollowUpsProps) {
  const router = useRouter();

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-400">No follow-ups today</p>
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {lead.customer_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {lead.property_name}
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
        </Card>
      ))}
    </div>
  );
}
