"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { addProperty, updateProperty } from "@/lib/firebase/inventory";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  Property,
  PropertyFormData,
  BHKType,
  PropertyType,
  PropertyStatus,
  FurnishingType,
} from "@/types";
import {
  BHK_TYPES,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  FURNISHING_TYPES,
} from "@/lib/utils/constants";
import { MapPin, Navigation } from "lucide-react";

interface PropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
}

export function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState<PropertyFormData>({
    project_name: property?.project_name || "",
    builder_name: property?.builder_name || "",
    unit_number: property?.unit_number || "",
    bhk_type: property?.bhk_type || "2 BHK",
    property_type: property?.property_type || "Apartment",
    carpet_area_sqft: property?.carpet_area_sqft || "",
    price: property?.price || "",
    price_per_sqft: property?.price_per_sqft || "",
    address: property?.address || "",
    city: property?.city || "",
    floor_number: property?.floor_number || "",
    furnishing: property?.furnishing || "Unfurnished",
    possession_date: property?.possession_date || "",
    status: property?.status || "Available",
    rera_id: property?.rera_id || "",
    amenities: property?.amenities || "",
    notes: property?.notes || "",
    latitude: property?.latitude || "",
    longitude: property?.longitude || "",
    google_maps_link: property?.google_maps_link || "",
  });

  const update = (field: keyof PropertyFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-calculate price per sqft
  useEffect(() => {
    const price = Number(form.price);
    const area = Number(form.carpet_area_sqft);
    if (price > 0 && area > 0) {
      update("price_per_sqft", Math.round(price / area));
    }
  }, [form.price, form.carpet_area_sqft]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          google_maps_link: `https://www.google.com/maps?q=${lat},${lng}`,
        }));
        setLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location. Please enter manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-generate maps link when lat/lng change manually
  useEffect(() => {
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (lat && lng && !form.google_maps_link) {
      update("google_maps_link", `https://www.google.com/maps?q=${lat},${lng}`);
    }
  }, [form.latitude, form.longitude]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (property) {
        await updateProperty(property.id, form);
      } else {
        await addProperty(user.uid, form, user.email);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/inventory");
      }
    } catch (error) {
      console.error("Failed to save property:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        value={form.project_name}
        onChange={(e) => update("project_name", e.target.value)}
        required
        placeholder="Green Valley Heights"
      />

      <Input
        label="Builder Name"
        value={form.builder_name}
        onChange={(e) => update("builder_name", e.target.value)}
        placeholder="ABC Developers"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Unit Number"
          value={form.unit_number}
          onChange={(e) => update("unit_number", e.target.value)}
          placeholder="A-101"
        />
        <Input
          label="Floor"
          value={form.floor_number}
          onChange={(e) => update("floor_number", e.target.value)}
          placeholder="10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="BHK Type"
          value={form.bhk_type}
          onChange={(e) => update("bhk_type", e.target.value as BHKType)}
          options={BHK_TYPES.map((b) => ({ value: b, label: b }))}
        />
        <Select
          label="Property Type"
          value={form.property_type}
          onChange={(e) =>
            update("property_type", e.target.value as PropertyType)
          }
          options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </div>

      <Input
        label="Carpet Area (sq ft)"
        type="number"
        value={form.carpet_area_sqft}
        onChange={(e) =>
          update(
            "carpet_area_sqft",
            e.target.value ? Number(e.target.value) : ""
          )
        }
        placeholder="1200"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Asking Price (₹)"
          type="number"
          value={form.price}
          onChange={(e) =>
            update("price", e.target.value ? Number(e.target.value) : "")
          }
          placeholder="7500000"
        />
        <Input
          label="Price/sq ft (₹)"
          type="number"
          value={form.price_per_sqft}
          onChange={(e) =>
            update(
              "price_per_sqft",
              e.target.value ? Number(e.target.value) : ""
            )
          }
          placeholder="Auto-calculated"
          readOnly={
            Number(form.price) > 0 && Number(form.carpet_area_sqft) > 0
          }
        />
      </div>

      <Input
        label="Address"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
        placeholder="123 Main St, Sector 50"
      />

      <Input
        label="City"
        value={form.city}
        onChange={(e) => update("city", e.target.value)}
        placeholder="Gurugram"
      />

      {/* Location Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Location on Map
          </h3>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleGetLocation}
            disabled={locating}
          >
            <Navigation className="h-3.5 w-3.5" />
            {locating ? "Locating..." : "Use My Location"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) =>
              update("latitude", e.target.value ? Number(e.target.value) : "")
            }
            placeholder="28.4595"
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) =>
              update("longitude", e.target.value ? Number(e.target.value) : "")
            }
            placeholder="77.0266"
          />
        </div>

        <Input
          label="Google Maps Link"
          value={form.google_maps_link}
          onChange={(e) => update("google_maps_link", e.target.value)}
          placeholder="https://maps.google.com/..."
        />

        {form.latitude && form.longitude && (
          <a
            href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <MapPin className="h-3 w-3" />
            View on Google Maps
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Furnishing"
          value={form.furnishing}
          onChange={(e) =>
            update("furnishing", e.target.value as FurnishingType)
          }
          options={FURNISHING_TYPES.map((f) => ({ value: f, label: f }))}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => update("status", e.target.value as PropertyStatus)}
          options={PROPERTY_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <Input
        label="Possession Date"
        value={form.possession_date}
        onChange={(e) => update("possession_date", e.target.value)}
        placeholder="Dec 2025 / Ready to move"
      />

      <Input
        label="RERA ID"
        value={form.rera_id}
        onChange={(e) => update("rera_id", e.target.value)}
        placeholder="RERA12345"
      />

      <Textarea
        label="Amenities"
        value={form.amenities}
        onChange={(e) => update("amenities", e.target.value)}
        placeholder="Swimming pool, Gym, Club house..."
      />

      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Additional details..."
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving} className="flex-1">
          {property ? "Update Property" : "Add Property"}
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
