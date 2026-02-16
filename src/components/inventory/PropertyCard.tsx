"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { Property } from "@/types";
import { Building, MapPin, User, IndianRupee, Ruler } from "lucide-react";

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `${(price / 100000).toFixed(2)} L`;
  }
  return price.toLocaleString("en-IN");
}

export function PropertyCard({
  property,
  showCreator,
}: {
  property: Property;
  showCreator?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/inventory/${property.id}`)}
      className="space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate">
          {property.project_name}
        </h3>
        <PropertyStatusBadge status={property.status} />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Building className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">
          {property.bhk_type} {property.property_type}
        </span>
        {property.unit_number && (
          <>
            <span className="text-gray-300">|</span>
            <span className="flex-shrink-0">Unit {property.unit_number}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        {property.price > 0 && (
          <div className="flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700">
              {formatPrice(property.price)}
            </span>
          </div>
        )}
        {property.carpet_area_sqft > 0 && (
          <div className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{property.carpet_area_sqft} sq ft</span>
          </div>
        )}
      </div>

      {property.builder_name && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Building className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{property.builder_name}</span>
        </div>
      )}

      {property.city && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{property.city}</span>
        </div>
      )}

      {showCreator && property.created_by_email && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <User className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{property.created_by_email}</span>
        </div>
      )}
    </Card>
  );
}
