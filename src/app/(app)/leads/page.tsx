"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLeads } from "@/hooks/useLeads";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadSearch } from "@/components/leads/LeadSearch";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { Spinner } from "@/components/ui/Spinner";
import { LeadFilters as LeadFiltersType } from "@/types";
import { Plus, Filter } from "lucide-react";

export default function LeadsPage() {
  const { leads, loading } = useLeads();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LeadFiltersType>({
    status: "All",
    interest: "All",
    property_type: "All",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      if (
        q &&
        !lead.customer_name.toLowerCase().includes(q) &&
        !lead.property_name.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.status !== "All" && lead.status !== filters.status)
        return false;
      if (filters.interest !== "All" && lead.customer_interest !== filters.interest)
        return false;
      if (
        filters.property_type !== "All" &&
        lead.property_type !== filters.property_type
      )
        return false;
      return true;
    });
  }, [leads, search, filters]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Leads</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border ${
              showFilters
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-500"
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
          <Link
            href="/leads/new"
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
      </div>

      <LeadSearch value={search} onChange={setSearch} />

      {showFilters && <LeadFilters filters={filters} onChange={setFilters} />}

      {loading ? (
        <Spinner className="py-12" />
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">
            {leads.length === 0 ? "No leads yet. Add your first lead!" : "No leads match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
