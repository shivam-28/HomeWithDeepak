"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { PropertyCard } from "@/components/inventory/PropertyCard";
import { PropertyFilters } from "@/components/inventory/PropertyFilters";
import { Spinner } from "@/components/ui/Spinner";
import { PropertyFiltersType } from "@/types";
import { Plus, Filter, Search, X } from "lucide-react";

export default function InventoryPage() {
  const { properties, loading } = useProperties();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFiltersType>({
    bhk_type: "All",
    property_type: "All",
    status: "All",
    furnishing: "All",
  });

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const q = search.toLowerCase();
      if (
        q &&
        !p.project_name.toLowerCase().includes(q) &&
        !p.builder_name.toLowerCase().includes(q) &&
        !p.city.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.bhk_type !== "All" && p.bhk_type !== filters.bhk_type)
        return false;
      if (
        filters.property_type !== "All" &&
        p.property_type !== filters.property_type
      )
        return false;
      if (filters.status !== "All" && p.status !== filters.status) return false;
      if (filters.furnishing !== "All" && p.furnishing !== filters.furnishing)
        return false;
      return true;
    });
  }, [properties, search, filters]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
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
            href="/inventory/new"
            className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by project, builder, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-h-[44px] rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {showFilters && (
        <PropertyFilters filters={filters} onChange={setFilters} />
      )}

      {loading ? (
        <Spinner className="py-12" />
      ) : filteredProperties.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">
            {properties.length === 0
              ? "No properties yet. Add your first property!"
              : "No properties match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showCreator={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
