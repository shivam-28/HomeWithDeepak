"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/inventory/PropertyForm";
import { ArrowLeft } from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Add Property</h2>
      </div>
      <PropertyForm />
    </div>
  );
}
