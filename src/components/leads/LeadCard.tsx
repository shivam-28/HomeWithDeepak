"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "./StatusBadge";
import { InterestBadge } from "./InterestBadge";
import { Lead } from "@/types";
import { formatDate } from "@/lib/utils/dates";
import { Phone, MapPin, Building } from "lucide-react";

export function LeadCard({ lead }: { lead: Lead }) {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(`/leads/${lead.id}`)} className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate">
          {lead.customer_name}
        </h3>
        <InterestBadge interest={lead.customer_interest} />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Building className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">{lead.property_name}</span>
        <span className="text-gray-300">|</span>
        <span className="flex-shrink-0">{lead.property_type}</span>
      </div>

      {lead.customer_phone && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <a
            href={`tel:${lead.customer_phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 active:text-blue-800"
          >
            {lead.customer_phone}
          </a>
        </div>
      )}

      {lead.customer_address && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{lead.customer_address}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={lead.status} />
        <span className="text-xs text-gray-400">
          {lead.follow_up_call
            ? `Follow-up: ${formatDate(lead.follow_up_call)}`
            : formatDate(lead.created_at)}
        </span>
      </div>
    </Card>
  );
}
