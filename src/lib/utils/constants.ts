import {
  LeadStatus,
  InterestLevel,
  PropertyType,
  BHKType,
  PropertyStatus,
  FurnishingType,
  LeadSource,
  LostReason,
} from "@/types";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "In Progress",
  "Visited",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export const INTEREST_LEVELS: InterestLevel[] = ["Hot", "Warm", "Cold"];

export const PROPERTY_TYPES: PropertyType[] = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Penthouse",
  "Studio",
  "Other",
];

export const BHK_TYPES: BHKType[] = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
];

export const PROPERTY_STATUSES: PropertyStatus[] = [
  "Available",
  "Reserved",
  "Sold",
];

export const FURNISHING_TYPES: FurnishingType[] = [
  "Unfurnished",
  "Semi-Furnished",
  "Fully Furnished",
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Visited: "bg-purple-100 text-purple-800",
  Negotiation: "bg-orange-100 text-orange-800",
  "Closed Won": "bg-green-100 text-green-800",
  "Closed Lost": "bg-red-100 text-red-800",
};

export const INTEREST_COLORS: Record<InterestLevel, string> = {
  Hot: "bg-red-100 text-red-800",
  Warm: "bg-amber-100 text-amber-800",
  Cold: "bg-sky-100 text-sky-800",
};

export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
  Available: "bg-green-100 text-green-800",
  Reserved: "bg-yellow-100 text-yellow-800",
  Sold: "bg-red-100 text-red-800",
};

export const LEAD_SOURCES: LeadSource[] = [
  "99acres",
  "MagicBricks",
  "Housing.com",
  "NoBroker",
  "Facebook",
  "Instagram",
  "Google Ads",
  "Walk-in",
  "Phone Inquiry",
  "WhatsApp",
  "Referral",
  "Builder/Developer",
  "Channel Partner",
  "Other",
];

export const LOST_REASONS: LostReason[] = [
  "Budget Constraint",
  "Location Mismatch",
  "Lost to Competitor",
  "Not Interested",
  "Bought Elsewhere",
  "Financing Issue",
  "Timeline Mismatch",
  "Other",
];
