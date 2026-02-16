"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/types";
import { rescheduleFollowUp, clearFollowUp } from "@/lib/firebase/firestore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { InterestBadge } from "@/components/leads/InterestBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils/dates";
import { Phone, Calendar, Check, ChevronRight } from "lucide-react";

interface FollowUpCardProps {
  lead: Lead;
  variant: "overdue" | "today" | "upcoming";
  onUpdate: () => void;
}

const variantStyles = {
  overdue: "border-l-4 border-l-red-500",
  today: "border-l-4 border-l-blue-500",
  upcoming: "border-l-4 border-l-gray-300",
};

export function FollowUpCard({ lead, variant, onUpdate }: FollowUpCardProps) {
  const router = useRouter();
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleReschedule = async () => {
    if (!newDate) return;
    setSaving(true);
    try {
      await rescheduleFollowUp(lead.id, new Date(newDate + "T00:00:00"));
      setShowReschedule(false);
      setNewDate("");
      onUpdate();
    } catch (error) {
      console.error("Failed to reschedule:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    setSaving(true);
    try {
      await clearFollowUp(lead.id);
      onUpdate();
    } catch (error) {
      console.error("Failed to clear follow-up:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className={`space-y-2 ${variantStyles[variant]}`}>
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={() => router.push(`/leads/${lead.id}`)}
        >
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {lead.customer_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{lead.property_name}</p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 mt-1" />
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          <InterestBadge interest={lead.customer_interest} />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(lead.follow_up_call)}
        </div>

        <div className="flex gap-2 pt-1">
          {lead.customer_phone && (
            <a
              href={`tel:${lead.customer_phone}`}
              className="flex min-h-[36px] items-center gap-1.5 rounded-lg bg-green-50 px-3 text-xs font-medium text-green-700 active:bg-green-100"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          )}
          <button
            onClick={() => setShowReschedule(true)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-medium text-blue-700 active:bg-blue-100"
          >
            <Calendar className="h-3.5 w-3.5" />
            Reschedule
          </button>
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="flex min-h-[36px] items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 active:bg-gray-200 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            Done
          </button>
        </div>
      </Card>

      <Modal
        open={showReschedule}
        onClose={() => setShowReschedule(false)}
        title="Reschedule Follow-up"
      >
        <div className="space-y-4">
          <Input
            label="New Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleReschedule}
              loading={saving}
              className="flex-1"
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowReschedule(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
