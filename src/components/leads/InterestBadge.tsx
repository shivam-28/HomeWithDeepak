"use client";

import { Badge } from "@/components/ui/Badge";
import { InterestLevel } from "@/types";
import { INTEREST_COLORS } from "@/lib/utils/constants";

export function InterestBadge({ interest }: { interest: InterestLevel }) {
  return <Badge className={INTEREST_COLORS[interest]}>{interest}</Badge>;
}
