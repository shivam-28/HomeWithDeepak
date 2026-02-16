"use client";

import { useMemo } from "react";
import { useProperties } from "@/hooks/useProperties";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PropertyStatusBadge } from "@/components/inventory/PropertyStatusBadge";
import { CustomerRequirements, Property } from "@/types";
import { Building, IndianRupee, Ruler, MapPin } from "lucide-react";

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function matchesRequirements(
  property: Property,
  req: CustomerRequirements
): boolean {
  if (property.status !== "Available") return false;

  if (req.preferred_bhk && req.preferred_bhk !== "Any") {
    if (property.bhk_type !== req.preferred_bhk) return false;
  }

  if (req.preferred_property_type && req.preferred_property_type !== "Any") {
    if (property.property_type !== req.preferred_property_type) return false;
  }

  if (req.min_area_sqft && Number(req.min_area_sqft) > 0) {
    if (property.carpet_area_sqft < Number(req.min_area_sqft)) return false;
  }

  if (req.min_budget && Number(req.min_budget) > 0) {
    if (property.price < Number(req.min_budget)) return false;
  }

  if (req.max_budget && Number(req.max_budget) > 0) {
    if (property.price > Number(req.max_budget)) return false;
  }

  if (req.preferred_location) {
    const loc = req.preferred_location.toLowerCase();
    const matchesLocation =
      (property.address && property.address.toLowerCase().includes(loc)) ||
      (property.city && property.city.toLowerCase().includes(loc));
    if (!matchesLocation) return false;
  }

  return true;
}

interface PropertySuggestionsProps {
  requirements: CustomerRequirements;
  linkedPropertyId?: string;
  onLink: (propertyId: string) => void;
  linking?: boolean;
}

export function PropertySuggestions({
  requirements,
  linkedPropertyId,
  onLink,
  linking,
}: PropertySuggestionsProps) {
  const { properties, loading } = useProperties();

  const suggestions = useMemo(() => {
    return properties.filter((p) => matchesRequirements(p, requirements));
  }, [properties, requirements]);

  if (loading) return null;
  if (suggestions.length === 0) {
    return (
      <Card className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Suggested Properties
        </h3>
        <p className="text-xs text-gray-500">
          No matching properties found in inventory.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Suggested Properties ({suggestions.length})
      </h3>
      <div className="space-y-2">
        {suggestions.map((p) => (
          <div
            key={p.id}
            className={`rounded-lg border p-3 space-y-1.5 ${
              p.id === linkedPropertyId
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {p.project_name}
              </span>
              <PropertyStatusBadge status={p.status} />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building className="h-3 w-3" />
              <span>
                {p.bhk_type} {p.property_type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {p.price > 0 && (
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {formatPrice(p.price)}
                </span>
              )}
              {p.carpet_area_sqft > 0 && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  {p.carpet_area_sqft} sqft
                </span>
              )}
              {p.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.city}
                </span>
              )}
            </div>
            {p.id !== linkedPropertyId ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onLink(p.id)}
                disabled={linking}
                className="mt-1"
              >
                Link to Lead
              </Button>
            ) : (
              <span className="inline-block mt-1 text-xs font-medium text-blue-600">
                Currently Linked
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
