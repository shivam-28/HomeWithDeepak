"use client";

import { Lead } from "@/types";
import { FollowUpCard } from "./FollowUpCard";

interface FollowUpListProps {
  title: string;
  leads: Lead[];
  variant: "overdue" | "today" | "upcoming";
  onUpdate: () => void;
}

export function FollowUpList({ title, leads, variant, onUpdate }: FollowUpListProps) {
  if (leads.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">
        {title} ({leads.length})
      </h3>
      {leads.map((lead) => (
        <FollowUpCard
          key={lead.id}
          lead={lead}
          variant={variant}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
