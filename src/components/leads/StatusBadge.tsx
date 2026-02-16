"use client";

import { Badge } from "@/components/ui/Badge";
import { LeadStatus } from "@/types";
import { STATUS_COLORS } from "@/lib/utils/constants";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge className={STATUS_COLORS[status]}>{status}</Badge>;
}
