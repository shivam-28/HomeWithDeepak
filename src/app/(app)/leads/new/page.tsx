"use client";

import { LeadForm } from "@/components/leads/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Add New Lead</h2>
      <LeadForm />
    </div>
  );
}
