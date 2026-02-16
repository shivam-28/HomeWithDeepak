"use client";

import { PropertyFiltersType } from "@/types";
import {
  BHK_TYPES,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  FURNISHING_TYPES,
} from "@/lib/utils/constants";

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onChange: (filters: PropertyFiltersType) => void;
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

export function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  return (
    <div className="space-y-2">
      {/* BHK Type */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All BHK"
          active={filters.bhk_type === "All"}
          onClick={() => onChange({ ...filters, bhk_type: "All" })}
        />
        {BHK_TYPES.map((b) => (
          <FilterChip
            key={b}
            label={b}
            active={filters.bhk_type === b}
            onClick={() => onChange({ ...filters, bhk_type: b })}
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

      {/* Status */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All Status"
          active={filters.status === "All"}
          onClick={() => onChange({ ...filters, status: "All" })}
        />
        {PROPERTY_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.status === s}
            onClick={() => onChange({ ...filters, status: s })}
          />
        ))}
      </div>

      {/* Furnishing */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <FilterChip
          label="All Furnishing"
          active={filters.furnishing === "All"}
          onClick={() => onChange({ ...filters, furnishing: "All" })}
        />
        {FURNISHING_TYPES.map((f) => (
          <FilterChip
            key={f}
            label={f}
            active={filters.furnishing === f}
            onClick={() => onChange({ ...filters, furnishing: f })}
          />
        ))}
      </div>
    </div>
  );
}
