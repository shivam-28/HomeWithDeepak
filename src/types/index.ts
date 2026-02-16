import { Timestamp } from "firebase/firestore";

export interface Lead {
  id: string;
  uid: string;
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

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Plot"
  | "Commercial"
  | "Penthouse"
  | "Studio"
  | "Other";

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
}

export interface LeadFilters {
  status: LeadStatus | "All";
  interest: InterestLevel | "All";
  property_type: PropertyType | "All";
}
