"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { addLead, updateLead } from "@/lib/firebase/firestore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Lead, LeadFormData, LeadStatus, InterestLevel, PropertyType } from "@/types";
import { LEAD_STATUSES, INTEREST_LEVELS, PROPERTY_TYPES } from "@/lib/utils/constants";
import { toInputDateString } from "@/lib/utils/dates";

interface LeadFormProps {
  lead?: Lead;
  onSuccess?: () => void;
}

export function LeadForm({ lead, onSuccess }: LeadFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<LeadFormData>({
    customer_name: lead?.customer_name || "",
    customer_address: lead?.customer_address || "",
    customer_phone: lead?.customer_phone || "",
    property_id: lead?.property_id || "",
    property_name: lead?.property_name || "",
    property_type: lead?.property_type || "Apartment",
    customer_interest: lead?.customer_interest || "Warm",
    property_visit: lead?.property_visit || false,
    visit_no: lead?.visit_no || 0,
    follow_up_call: lead?.follow_up_call?.toDate() || null,
    status: lead?.status || "New",
  });

  const update = (field: keyof LeadFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (lead) {
        await updateLead(lead.id, form);
      } else {
        await addLead(user.uid, form);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/leads");
      }
    } catch (error) {
      console.error("Failed to save lead:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Customer Name"
        value={form.customer_name}
        onChange={(e) => update("customer_name", e.target.value)}
        required
        placeholder="John Doe"
      />

      <Input
        label="Phone Number"
        type="tel"
        value={form.customer_phone}
        onChange={(e) => update("customer_phone", e.target.value)}
        placeholder="+91 98765 43210"
      />

      <Input
        label="Address"
        value={form.customer_address}
        onChange={(e) => update("customer_address", e.target.value)}
        placeholder="123 Main St, City"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Property ID"
          value={form.property_id}
          onChange={(e) => update("property_id", e.target.value)}
          placeholder="PROP-001"
        />
        <Input
          label="Property Name"
          value={form.property_name}
          onChange={(e) => update("property_name", e.target.value)}
          placeholder="Green Valley"
        />
      </div>

      <Select
        label="Property Type"
        value={form.property_type}
        onChange={(e) => update("property_type", e.target.value as PropertyType)}
        options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Interest Level"
          value={form.customer_interest}
          onChange={(e) =>
            update("customer_interest", e.target.value as InterestLevel)
          }
          options={INTEREST_LEVELS.map((i) => ({ value: i, label: i }))}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => update("status", e.target.value as LeadStatus)}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <Input
        label="Follow-up Date"
        type="date"
        value={toInputDateString(form.follow_up_call)}
        onChange={(e) => {
          const val = e.target.value;
          update("follow_up_call", val ? new Date(val + "T00:00:00") : null);
        }}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving} className="flex-1">
          {lead ? "Update Lead" : "Add Lead"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
