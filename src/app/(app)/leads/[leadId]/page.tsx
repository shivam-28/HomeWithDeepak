"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLead } from "@/hooks/useLead";
import { useAuth } from "@/hooks/useAuth";
import { deleteLead, linkPropertyToLead } from "@/lib/firebase/firestore";
import { getProperty } from "@/lib/firebase/inventory";
import { LeadForm } from "@/components/leads/LeadForm";
import { NotesList } from "@/components/leads/NotesList";
import { VisitLogger } from "@/components/leads/VisitLogger";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { InterestBadge } from "@/components/leads/InterestBadge";
import { PropertySuggestions } from "@/components/leads/PropertySuggestions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import { Property } from "@/types";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Building,
  Calendar,
  Hash,
  User,
  Link as LinkIcon,
  IndianRupee,
  Megaphone,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;
  const { lead, loading, refetch } = useLead(leadId);
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [linkedProperty, setLinkedProperty] = useState<Property | null>(null);
  const [linkedLoaded, setLinkedLoaded] = useState(false);
  const [linking, setLinking] = useState(false);

  // Load linked property details
  useEffect(() => {
    if (lead?.linked_property_id && !linkedLoaded) {
      getProperty(lead.linked_property_id).then((p) => {
        setLinkedProperty(p);
        setLinkedLoaded(true);
      });
    }
  }, [lead?.linked_property_id, linkedLoaded]);

  const handleLinkProperty = async (propertyId: string) => {
    setLinking(true);
    try {
      await linkPropertyToLead(leadId, propertyId);
      const p = await getProperty(propertyId);
      setLinkedProperty(p);
      await refetch();
    } catch (error) {
      console.error("Failed to link property:", error);
    } finally {
      setLinking(false);
    }
  };

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
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={lead.status} />
        <InterestBadge interest={lead.customer_interest} />
        {lead.lead_source && (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            <Megaphone className="h-3 w-3" />
            {lead.lead_source}
          </span>
        )}
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

      {/* Closure Details — Closed Won */}
      {lead.status === "Closed Won" && (lead.deal_amount || lead.closing_remarks) && (
        <Card className="space-y-2 border-green-200 bg-green-50">
          <h3 className="text-sm font-semibold text-green-800 flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            Deal Closed
          </h3>
          {lead.deal_amount && lead.deal_amount > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-green-700">
              <IndianRupee className="h-3.5 w-3.5" />
              <span className="font-medium">
                {lead.deal_amount >= 10000000
                  ? `${(lead.deal_amount / 10000000).toFixed(2)} Cr`
                  : lead.deal_amount >= 100000
                  ? `${(lead.deal_amount / 100000).toFixed(2)} L`
                  : lead.deal_amount.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          {lead.closing_remarks && (
            <p className="text-xs text-green-700">{lead.closing_remarks}</p>
          )}
        </Card>
      )}

      {/* Closure Details — Closed Lost */}
      {lead.status === "Closed Lost" && (lead.lost_reason || lead.lost_remarks) && (
        <Card className="space-y-2 border-red-200 bg-red-50">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
            <XCircle className="h-4 w-4" />
            Deal Lost
          </h3>
          {lead.lost_reason && (
            <p className="text-sm font-medium text-red-700">
              Reason: {lead.lost_reason}
            </p>
          )}
          {lead.lost_remarks && (
            <p className="text-xs text-red-700">{lead.lost_remarks}</p>
          )}
        </Card>
      )}

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

      {/* Linked Property */}
      {lead.linked_property_id && linkedProperty && (
        <Card className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <LinkIcon className="h-4 w-4" />
            Linked Property
          </h3>
          <div className="rounded-md bg-gray-50 p-2.5 space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {linkedProperty.project_name}
            </p>
            <p className="text-xs text-gray-600">
              {linkedProperty.bhk_type} {linkedProperty.property_type}
              {linkedProperty.carpet_area_sqft > 0 &&
                ` | ${linkedProperty.carpet_area_sqft} sq ft`}
            </p>
            {linkedProperty.price > 0 && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {linkedProperty.price >= 10000000
                  ? `${(linkedProperty.price / 10000000).toFixed(2)} Cr`
                  : linkedProperty.price >= 100000
                  ? `${(linkedProperty.price / 100000).toFixed(2)} L`
                  : linkedProperty.price.toLocaleString("en-IN")}
              </p>
            )}
            {linkedProperty.status === "Sold" && lead.status !== "Closed Won" && lead.status !== "Closed Lost" && (
              <div className="mt-1.5 flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700 border border-amber-200">
                <AlertTriangle className="h-3 w-3" />
                This property has been sold. Consider closing this lead.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Customer Requirements */}
      {lead.customer_requirements &&
        (lead.customer_requirements.preferred_bhk ||
          lead.customer_requirements.max_budget ||
          lead.customer_requirements.preferred_location) && (
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Customer Requirements
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {lead.customer_requirements.preferred_bhk && (
                <div>
                  <span className="text-gray-400">BHK:</span>{" "}
                  {lead.customer_requirements.preferred_bhk}
                </div>
              )}
              {lead.customer_requirements.preferred_property_type && (
                <div>
                  <span className="text-gray-400">Type:</span>{" "}
                  {lead.customer_requirements.preferred_property_type}
                </div>
              )}
              {lead.customer_requirements.min_area_sqft && (
                <div>
                  <span className="text-gray-400">Min Area:</span>{" "}
                  {lead.customer_requirements.min_area_sqft} sq ft
                </div>
              )}
              {(lead.customer_requirements.min_budget || lead.customer_requirements.max_budget) && (
                <div className="col-span-2">
                  <span className="text-gray-400">Budget:</span>{" "}
                  {lead.customer_requirements.min_budget
                    ? `₹${
                        Number(lead.customer_requirements.min_budget) >= 100000
                          ? `${(Number(lead.customer_requirements.min_budget) / 100000).toFixed(1)} L`
                          : lead.customer_requirements.min_budget
                      }`
                    : ""}
                  {lead.customer_requirements.min_budget && lead.customer_requirements.max_budget
                    ? " - "
                    : ""}
                  {lead.customer_requirements.max_budget
                    ? `₹${
                        Number(lead.customer_requirements.max_budget) >= 100000
                          ? `${(Number(lead.customer_requirements.max_budget) / 100000).toFixed(1)} L`
                          : lead.customer_requirements.max_budget
                      }`
                    : ""}
                </div>
              )}
              {lead.customer_requirements.preferred_location && (
                <div className="col-span-2">
                  <span className="text-gray-400">Location:</span>{" "}
                  {lead.customer_requirements.preferred_location}
                </div>
              )}
              {lead.customer_requirements.additional_requirements && (
                <div className="col-span-2">
                  <span className="text-gray-400">Notes:</span>{" "}
                  {lead.customer_requirements.additional_requirements}
                </div>
              )}
            </div>
          </Card>
        )}

      {/* Suggested Properties */}
      {lead.customer_requirements &&
        (lead.customer_requirements.preferred_bhk ||
          lead.customer_requirements.max_budget ||
          lead.customer_requirements.preferred_location ||
          lead.customer_requirements.min_area_sqft) && (
          <PropertySuggestions
            requirements={lead.customer_requirements}
            linkedPropertyId={lead.linked_property_id}
            onLink={handleLinkProperty}
            linking={linking}
          />
        )}

      {/* Timestamps */}
      <div className="pt-2 text-xs text-gray-400 space-y-1">
        {isAdmin && lead.created_by_email && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>Created by: {lead.created_by_email}</span>
          </div>
        )}
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
