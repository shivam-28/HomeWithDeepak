"use client";

import { Search, X } from "lucide-react";

interface LeadSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function LeadSearch({ value, onChange }: LeadSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name or property..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
