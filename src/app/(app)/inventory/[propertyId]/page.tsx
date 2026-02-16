"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProperty } from "@/hooks/useProperty";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteProperty,
  updatePropertyStatus,
  markPropertySold,
  subscribeToLeadsByProperty,
} from "@/lib/firebase/inventory";
import { closeLeadWon } from "@/lib/firebase/firestore";
import { PropertyForm } from "@/components/inventory/PropertyForm";
import { PropertyStatusBadge } from "@/components/inventory/PropertyStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { PropertyStatus, Lead } from "@/types";
import { PROPERTY_STATUSES } from "@/lib/utils/constants";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Building,
  MapPin,
  IndianRupee,
  Ruler,
  User,
  Home,
  FileText,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  Users,
} from "lucide-react";

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;
  const { property, loading, refetch } = useProperty(propertyId);
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [linkedLeads, setLinkedLeads] = useState<Lead[]>([]);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Subscribe to leads linked to this property
  useEffect(() => {
    const unsubscribe = subscribeToLeadsByProperty(propertyId, setLinkedLeads);
    return unsubscribe;
  }, [propertyId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProperty(propertyId);
      router.push("/inventory");
    } catch (error) {
      console.error("Failed to delete property:", error);
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: PropertyStatus) => {
    if (!property || property.status === status) return;

    // If marking as Sold and there are linked leads, show confirmation
    if (status === "Sold" && linkedLeads.length > 0) {
      setShowSoldModal(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      await updatePropertyStatus(propertyId, status);
      await refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleMarkSoldAndCloseLeads = async () => {
    setUpdatingStatus(true);
    try {
      await markPropertySold(propertyId);
      // Close all linked leads as won
      for (const lead of linkedLeads) {
        if (lead.status !== "Closed Won" && lead.status !== "Closed Lost") {
          await closeLeadWon(
            lead.id,
            property?.price,
            `Property ${property?.project_name} marked as Sold`
          );
        }
      }
      await refetch();
    } catch (error) {
      console.error("Failed to mark sold:", error);
    } finally {
      setUpdatingStatus(false);
      setShowSoldModal(false);
    }
  };

  const handleMarkSoldOnly = async () => {
    setUpdatingStatus(true);
    try {
      await markPropertySold(propertyId);
      await refetch();
    } catch (error) {
      console.error("Failed to mark sold:", error);
    } finally {
      setUpdatingStatus(false);
      setShowSoldModal(false);
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!property) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm text-gray-500">Property not found.</p>
        <Button
          variant="ghost"
          onClick={() => router.push("/inventory")}
          className="mt-4"
        >
          Back to Inventory
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
          <h2 className="text-xl font-bold text-gray-900">Edit Property</h2>
        </div>
        <PropertyForm
          property={property}
          onSuccess={() => {
            setEditing(false);
            refetch();
          }}
        />
      </div>
    );
  }

  const mapsLink =
    property.google_maps_link ||
    (property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : null);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/inventory")}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {property.project_name}
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

      {/* Status Badge */}
      <div className="flex gap-2">
        <PropertyStatusBadge status={property.status} />
      </div>

      {/* Property Images */}
      {property.images && property.images.length > 0 && (
        <Card className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            Photos ({property.images.length})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {property.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Property ${index + 1}`}
                className="h-24 w-full rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90"
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Status Toggle */}
      <Card className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">Quick Status</h3>
        <div className="flex gap-2">
          {PROPERTY_STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={property.status === s ? "primary" : "secondary"}
              onClick={() => handleStatusChange(s)}
              disabled={updatingStatus}
            >
              {s}
            </Button>
          ))}
        </div>
      </Card>

      {/* Property Info */}
      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Property Details
        </h3>
        <div className="flex items-center gap-2.5">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {property.bhk_type} {property.property_type}
          </span>
        </div>
        {property.unit_number && (
          <div className="flex items-center gap-2.5">
            <Home className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              Unit {property.unit_number}
              {property.floor_number
                ? `, Floor ${property.floor_number}`
                : ""}
            </span>
          </div>
        )}
        {property.builder_name && (
          <div className="flex items-center gap-2.5">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {property.builder_name}
            </span>
          </div>
        )}
        {property.carpet_area_sqft > 0 && (
          <div className="flex items-center gap-2.5">
            <Ruler className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {property.carpet_area_sqft} sq ft
            </span>
          </div>
        )}
        {property.furnishing && (
          <div className="flex items-center gap-2.5">
            <Home className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{property.furnishing}</span>
          </div>
        )}
      </Card>

      {/* Pricing */}
      {property.price > 0 && (
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Pricing</h3>
          <div className="flex items-center gap-2.5">
            <IndianRupee className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              Asking Price:{" "}
              <span className="font-medium text-gray-900">
                {formatPrice(property.price)}
              </span>
            </span>
          </div>
          {property.price_per_sqft > 0 && (
            <div className="flex items-center gap-2.5">
              <IndianRupee className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                ₹{property.price_per_sqft.toLocaleString("en-IN")}/sq ft
              </span>
            </div>
          )}
          {property.sold_price && property.sold_price > 0 && (
            <div className="flex items-center gap-2.5">
              <IndianRupee className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">
                Sold Price:{" "}
                <span className="font-medium">
                  {formatPrice(property.sold_price)}
                </span>
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Location */}
      {(property.address || property.city || mapsLink) && (
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Location</h3>
          {property.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{property.address}</span>
            </div>
          )}
          {property.city && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{property.city}</span>
            </div>
          )}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          )}
        </Card>
      )}

      {/* Linked Leads */}
      {linkedLeads.length > 0 && (
        <Card className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Linked Leads ({linkedLeads.length})
          </h3>
          <div className="space-y-1.5">
            {linkedLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => router.push(`/leads/${lead.id}`)}
                className="flex items-center justify-between rounded-md bg-gray-50 p-2 cursor-pointer hover:bg-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">{lead.status}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {lead.customer_phone}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Additional Info */}
      {(property.possession_date ||
        property.rera_id ||
        property.amenities ||
        property.notes ||
        property.sold_date) && (
        <Card className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Additional Info
          </h3>
          {property.sold_date && (
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">
                Sold on: {property.sold_date}
              </span>
            </div>
          )}
          {property.possession_date && (
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                Possession: {property.possession_date}
              </span>
            </div>
          )}
          {property.rera_id && (
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                RERA: {property.rera_id}
              </span>
            </div>
          )}
          {property.amenities && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">
                Amenities
              </span>
              <p className="text-sm text-gray-700">{property.amenities}</p>
            </div>
          )}
          {property.notes && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Notes</span>
              <p className="text-sm text-gray-700">{property.notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Timestamps */}
      <div className="pt-2 text-xs text-gray-400 space-y-1">
        {isAdmin && property.created_by_email && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>Created by: {property.created_by_email}</span>
          </div>
        )}
        <p>Created: {property.created_at?.toDate?.().toLocaleDateString()}</p>
        <p>Updated: {property.updated_at?.toDate?.().toLocaleDateString()}</p>
      </div>

      {/* Delete Modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Property"
      >
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete {property.project_name}? This action
          cannot be undone.
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

      {/* Mark Sold Modal — asks about linked leads */}
      <Modal
        open={showSoldModal}
        onClose={() => setShowSoldModal(false)}
        title="Mark as Sold"
      >
        <p className="mb-2 text-sm text-gray-600">
          This property has {linkedLeads.length} linked lead
          {linkedLeads.length > 1 ? "s" : ""}:
        </p>
        <ul className="mb-4 space-y-1">
          {linkedLeads.map((lead) => (
            <li key={lead.id} className="text-sm text-gray-700">
              - {lead.customer_name} ({lead.status})
            </li>
          ))}
        </ul>
        <p className="mb-4 text-sm text-gray-600">
          Do you want to also close linked leads as &quot;Closed Won&quot;?
        </p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleMarkSoldAndCloseLeads}
            loading={updatingStatus}
          >
            Mark Sold + Close Leads
          </Button>
          <Button
            variant="secondary"
            onClick={handleMarkSoldOnly}
            disabled={updatingStatus}
          >
            Mark Sold Only
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowSoldModal(false)}
            disabled={updatingStatus}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Image Lightbox */}
      {selectedImageIndex !== null && property.images && (
        <Modal
          open={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
          title={`Photo ${selectedImageIndex + 1} of ${property.images.length}`}
        >
          <img
            src={property.images[selectedImageIndex]}
            alt={`Property photo ${selectedImageIndex + 1}`}
            className="w-full rounded-lg"
          />
          <div className="mt-3 flex gap-2 justify-center">
            <Button
              size="sm"
              variant="secondary"
              disabled={selectedImageIndex === 0}
              onClick={() => setSelectedImageIndex((prev) => (prev ?? 1) - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={selectedImageIndex === property.images.length - 1}
              onClick={() => setSelectedImageIndex((prev) => (prev ?? 0) + 1)}
            >
              Next
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
