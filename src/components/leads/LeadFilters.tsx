"use client";

import { LeadFilters as LeadFiltersType } from "@/types";
import { LEAD_STATUSES, INTEREST_LEVELS, PROPERTY_TYPES } from "@/lib/utils/constants";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onChange: (filters: LeadFiltersType) => void;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[36px] whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  return (
    <div className="space-y-2">
      {/* Status */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All Status"
          active={filters.status === "All"}
          onClick={() => onChange({ ...filters, status: "All" })}
        />
        {LEAD_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.status === s}
            onClick={() => onChange({ ...filters, status: s })}
          />
        ))}
      </div>

      {/* Interest */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All Interest"
          active={filters.interest === "All"}
          onClick={() => onChange({ ...filters, interest: "All" })}
        />
        {INTEREST_LEVELS.map((i) => (
          <FilterChip
            key={i}
            label={i}
            active={filters.interest === i}
            onClick={() => onChange({ ...filters, interest: i })}
          />
        ))}
      </div>

      {/* Property Type */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All Types"
          active={filters.property_type === "All"}
          onClick={() => onChange({ ...filters, property_type: "All" })}
        />
        {PROPERTY_TYPES.map((p) => (
          <FilterChip
            key={p}
            label={p}
            active={filters.property_type === p}
            onClick={() => onChange({ ...filters, property_type: p })}
          />
        ))}
      </div>
    </div>
  );
}
