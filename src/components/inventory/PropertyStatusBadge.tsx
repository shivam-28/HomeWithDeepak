"use client";

import { Badge } from "@/components/ui/Badge";
import { PropertyStatus } from "@/types";
import { PROPERTY_STATUS_COLORS } from "@/lib/utils/constants";

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge className={PROPERTY_STATUS_COLORS[status]}>{status}</Badge>;
}
