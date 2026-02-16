"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { addLead, updateLead } from "@/lib/firebase/firestore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  Lead,
  LeadFormData,
  LeadStatus,
  InterestLevel,
  PropertyType,
  BHKType,
  LeadSource,
  LostReason,
  CustomerRequirements,
} from "@/types";
import {
  LEAD_STATUSES,
  INTEREST_LEVELS,
  PROPERTY_TYPES,
  BHK_TYPES,
  LEAD_SOURCES,
  LOST_REASONS,
} from "@/lib/utils/constants";
import { toInputDateString } from "@/lib/utils/dates";

interface LeadFormProps {
  lead?: Lead;
  onSuccess?: () => void;
}

const emptyRequirements: CustomerRequirements = {
  preferred_bhk: "",
  preferred_property_type: "",
  min_area_sqft: "",
  min_budget: "",
  max_budget: "",
  preferred_location: "",
  additional_requirements: "",
};

export function LeadForm({ lead, onSuccess }: LeadFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { properties } = useProperties();
  const [saving, setSaving] = useState(false);

  const availableProperties = properties.filter((p) => p.status === "Available");

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
    lead_source: lead?.lead_source || "",
    customer_requirements: lead?.customer_requirements || { ...emptyRequirements },
    linked_property_id: lead?.linked_property_id || "",
    deal_amount: lead?.deal_amount || "",
    closing_remarks: lead?.closing_remarks || "",
    lost_reason: lead?.lost_reason || "",
    lost_remarks: lead?.lost_remarks || "",
  });

  const update = (field: keyof LeadFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateReq = (field: keyof CustomerRequirements, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      customer_requirements: {
        ...(prev.customer_requirements || emptyRequirements),
        [field]: value,
      },
    }));
  };

  const handleInventorySelect = (propertyId: string) => {
    if (!propertyId) {
      update("linked_property_id", "");
      return;
    }
    const selected = properties.find((p) => p.id === propertyId);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        linked_property_id: propertyId,
        property_id: selected.unit_number || propertyId,
        property_name: selected.project_name,
        property_type: selected.property_type,
      }));
    }
  };

  const linkedProperty = form.linked_property_id
    ? properties.find((p) => p.id === form.linked_property_id)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (lead) {
        await updateLead(lead.id, form);
      } else {
        await addLead(user.uid, form, user.email);
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

  const req = form.customer_requirements || emptyRequirements;

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

      <Select
        label="Lead Source"
        value={form.lead_source || ""}
        onChange={(e) => update("lead_source", e.target.value as LeadSource | "")}
        options={[
          { value: "", label: "-- Select Source --" },
          ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
        ]}
      />

      {/* Link Property from Inventory */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Link Property from Inventory
        </h3>
        <Select
          label="Select Property"
          value={form.linked_property_id || ""}
          onChange={(e) => handleInventorySelect(e.target.value)}
          options={[
            { value: "", label: "-- Manual Entry --" },
            ...availableProperties.map((p) => ({
              value: p.id,
              label: `${p.project_name} - ${p.bhk_type} (${p.unit_number || "N/A"})`,
            })),
          ]}
        />
        {linkedProperty && (
          <div className="rounded-md bg-white p-2 text-xs text-gray-600 border border-gray-200">
            <p className="font-medium text-gray-800">
              {linkedProperty.project_name}
            </p>
            <p>
              {linkedProperty.bhk_type} {linkedProperty.property_type} |{" "}
              {linkedProperty.carpet_area_sqft} sq ft |{" "}
              {linkedProperty.city}
            </p>
          </div>
        )}
      </div>

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

      {/* Closure Details — Closed Won */}
      {form.status === "Closed Won" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-3">
          <h3 className="text-sm font-semibold text-green-800">
            Deal Closure Details
          </h3>
          <Input
            label="Deal Amount (₹)"
            type="number"
            value={form.deal_amount || ""}
            onChange={(e) =>
              update("deal_amount", e.target.value ? Number(e.target.value) : "")
            }
            placeholder="7500000"
          />
          <Textarea
            label="Closing Remarks"
            value={form.closing_remarks || ""}
            onChange={(e) => update("closing_remarks", e.target.value)}
            placeholder="Deal finalized with 5% discount..."
          />
        </div>
      )}

      {/* Closure Details — Closed Lost */}
      {form.status === "Closed Lost" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-3">
          <h3 className="text-sm font-semibold text-red-800">
            Lost Details
          </h3>
          <Select
            label="Lost Reason"
            value={form.lost_reason || ""}
            onChange={(e) =>
              update("lost_reason", e.target.value as LostReason | "")
            }
            options={[
              { value: "", label: "-- Select Reason --" },
              ...LOST_REASONS.map((r) => ({ value: r, label: r })),
            ]}
          />
          <Textarea
            label="Lost Remarks"
            value={form.lost_remarks || ""}
            onChange={(e) => update("lost_remarks", e.target.value)}
            placeholder="Customer went with competitor offer..."
          />
        </div>
      )}

      <Input
        label="Follow-up Date"
        type="date"
        value={toInputDateString(form.follow_up_call)}
        onChange={(e) => {
          const val = e.target.value;
          update("follow_up_call", val ? new Date(val + "T00:00:00") : null);
        }}
      />

      {/* Customer Requirements */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Customer Requirements
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Preferred BHK"
            value={req.preferred_bhk}
            onChange={(e) =>
              updateReq("preferred_bhk", e.target.value as BHKType | "Any" | "")
            }
            options={[
              { value: "", label: "-- Not Set --" },
              { value: "Any", label: "Any" },
              ...BHK_TYPES.map((b) => ({ value: b, label: b })),
            ]}
          />
          <Select
            label="Preferred Type"
            value={req.preferred_property_type}
            onChange={(e) =>
              updateReq(
                "preferred_property_type",
                e.target.value as PropertyType | "Any" | ""
              )
            }
            options={[
              { value: "", label: "-- Not Set --" },
              { value: "Any", label: "Any" },
              ...PROPERTY_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>

        <Input
          label="Min Area (sq ft)"
          type="number"
          value={req.min_area_sqft}
          onChange={(e) =>
            updateReq(
              "min_area_sqft",
              e.target.value ? Number(e.target.value) : ""
            )
          }
          placeholder="800"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Budget (₹)"
            type="number"
            value={req.min_budget}
            onChange={(e) =>
              updateReq(
                "min_budget",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            placeholder="5000000"
          />
          <Input
            label="Max Budget (₹)"
            type="number"
            value={req.max_budget}
            onChange={(e) =>
              updateReq(
                "max_budget",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            placeholder="7500000"
          />
        </div>

        <Input
          label="Preferred Location"
          value={req.preferred_location}
          onChange={(e) => updateReq("preferred_location", e.target.value)}
          placeholder="Sector 50, Gurugram"
        />

        <Textarea
          label="Additional Requirements"
          value={req.additional_requirements}
          onChange={(e) =>
            updateReq("additional_requirements", e.target.value)
          }
          placeholder="Corner unit, vastu compliant, near school..."
        />
      </div>

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
