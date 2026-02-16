import { Timestamp } from "firebase/firestore";

// --- Lead types ---

export interface Lead {
  id: string;
  uid: string;
  created_by_email?: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  property_id: string;
  property_name: string;
  property_type: PropertyType;
  customer_interest: InterestLevel;
  property_visit: boolean;
  visit_no: number;
  follow_up_call: Timestamp | null;
  status: LeadStatus;
  notes: Note[];
  lead_source?: LeadSource | "";
  customer_requirements?: CustomerRequirements;
  linked_property_id?: string;
  deal_amount?: number;
  closing_remarks?: string;
  lost_reason?: LostReason | "";
  lost_remarks?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Note {
  id: string;
  text: string;
  created_at: Timestamp;
}

export type LeadStatus =
  | "New"
  | "In Progress"
  | "Visited"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type InterestLevel = "Hot" | "Warm" | "Cold";

export type LeadSource =
  | "99acres"
  | "MagicBricks"
  | "Housing.com"
  | "NoBroker"
  | "Facebook"
  | "Instagram"
  | "Google Ads"
  | "Walk-in"
  | "Phone Inquiry"
  | "WhatsApp"
  | "Referral"
  | "Builder/Developer"
  | "Channel Partner"
  | "Other";

export type LostReason =
  | "Budget Constraint"
  | "Location Mismatch"
  | "Lost to Competitor"
  | "Not Interested"
  | "Bought Elsewhere"
  | "Financing Issue"
  | "Timeline Mismatch"
  | "Other";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Plot"
  | "Commercial"
  | "Penthouse"
  | "Studio"
  | "Other";

export interface CustomerRequirements {
  preferred_bhk: BHKType | "Any" | "";
  preferred_property_type: PropertyType | "Any" | "";
  min_area_sqft: number | "";
  min_budget: number | "";
  max_budget: number | "";
  preferred_location: string;
  additional_requirements: string;
}

export interface LeadFormData {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  property_id: string;
  property_name: string;
  property_type: PropertyType;
  customer_interest: InterestLevel;
  property_visit: boolean;
  visit_no: number;
  follow_up_call: Date | null;
  status: LeadStatus;
  lead_source?: LeadSource | "";
  customer_requirements?: CustomerRequirements;
  linked_property_id?: string;
  deal_amount?: number | "";
  closing_remarks?: string;
  lost_reason?: LostReason | "";
  lost_remarks?: string;
}

export interface LeadFilters {
  status: LeadStatus | "All";
  interest: InterestLevel | "All";
  property_type: PropertyType | "All";
}

// --- Inventory / Property types ---

export type BHKType = "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5+ BHK";

export type PropertyStatus = "Available" | "Reserved" | "Sold";

export type FurnishingType = "Unfurnished" | "Semi-Furnished" | "Fully Furnished";

export interface Property {
  id: string;
  uid: string;
  created_by_email?: string;
  project_name: string;
  builder_name: string;
  unit_number: string;
  bhk_type: BHKType;
  property_type: PropertyType;
  carpet_area_sqft: number;
  price: number;
  price_per_sqft: number;
  address: string;
  city: string;
  floor_number: string;
  furnishing: FurnishingType;
  possession_date: string;
  status: PropertyStatus;
  rera_id: string;
  amenities: string;
  notes: string;
  latitude: number | "";
  longitude: number | "";
  google_maps_link: string;
  sold_to_lead_id?: string;
  sold_price?: number;
  sold_date?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface PropertyFormData {
  project_name: string;
  builder_name: string;
  unit_number: string;
  bhk_type: BHKType;
  property_type: PropertyType;
  carpet_area_sqft: number | "";
  price: number | "";
  price_per_sqft: number | "";
  address: string;
  city: string;
  floor_number: string;
  furnishing: FurnishingType;
  possession_date: string;
  status: PropertyStatus;
  rera_id: string;
  amenities: string;
  notes: string;
  latitude: number | "";
  longitude: number | "";
  google_maps_link: string;
}

export interface PropertyFiltersType {
  bhk_type: BHKType | "All";
  property_type: PropertyType | "All";
  status: PropertyStatus | "All";
  furnishing: FurnishingType | "All";
}
