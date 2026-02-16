"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLead } from "@/hooks/useLead";
import { deleteLead } from "@/lib/firebase/firestore";
import { LeadForm } from "@/components/leads/LeadForm";
import { NotesList } from "@/components/leads/NotesList";
import { VisitLogger } from "@/components/leads/VisitLogger";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { InterestBadge } from "@/components/leads/InterestBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Building,
  Calendar,
  Hash,
} from "lucide-react";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;
  const { lead, loading, refetch } = useLead(leadId);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(leadId);
      router.push("/leads");
    } catch (error) {
      console.error("Failed to delete lead:", error);
      setDeleting(false);
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!lead) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm text-gray-500">Lead not found.</p>
        <Button variant="ghost" onClick={() => router.push("/leads")} className="mt-4">
          Back to Leads
        </Button>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="px-4 py-4">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setEditing(false)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Edit Lead</h2>
        </div>
        <LeadForm
          lead={lead}
          onSuccess={() => {
            setEditing(false);
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/leads")}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {lead.customer_name}
          </h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setEditing(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <StatusBadge status={lead.status} />
        <InterestBadge interest={lead.customer_interest} />
      </div>

      {/* Contact Info */}
      <Card className="space-y-3">
        {lead.customer_phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-gray-400" />
            <a
              href={`tel:${lead.customer_phone}`}
              className="text-sm font-medium text-blue-600 active:text-blue-800"
            >
              {lead.customer_phone}
            </a>
          </div>
        )}
        {lead.customer_address && (
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{lead.customer_address}</span>
          </div>
        )}
      </Card>

      {/* Property Info */}
      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Property</h3>
        <div className="flex items-center gap-2.5">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {lead.property_name} ({lead.property_type})
          </span>
        </div>
        {lead.property_id && (
          <div className="flex items-center gap-2.5">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{lead.property_id}</span>
          </div>
        )}
        {lead.follow_up_call && (
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              Follow-up: {formatDate(lead.follow_up_call)}
            </span>
          </div>
        )}
      </Card>

      {/* Visit Logger */}
      <VisitLogger
        leadId={lead.id}
        visitCount={lead.visit_no}
        onVisitLogged={refetch}
      />

      {/* Notes */}
      <NotesList leadId={lead.id} notes={lead.notes} onNoteAdded={refetch} />

      {/* Timestamps */}
      <div className="pt-2 text-xs text-gray-400 space-y-1">
        <p>Created: {formatDateTime(lead.created_at)}</p>
        <p>Updated: {formatDateTime(lead.updated_at)}</p>
      </div>

      {/* Delete Modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Lead"
      >
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete {lead.customer_name}? This action cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            className="flex-1"
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
