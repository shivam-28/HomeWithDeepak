"use client";

import { useState } from "react";
import { logVisit } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { MapPin } from "lucide-react";

interface VisitLoggerProps {
  leadId: string;
  visitCount: number;
  onVisitLogged: () => void;
}

export function VisitLogger({ leadId, visitCount, onVisitLogged }: VisitLoggerProps) {
  const [logging, setLogging] = useState(false);

  const handleLog = async () => {
    setLogging(true);
    try {
      await logVisit(leadId);
      onVisitLogged();
    } catch (error) {
      console.error("Failed to log visit:", error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          Visits: <strong>{visitCount}</strong>
        </span>
      </div>
      <Button onClick={handleLog} loading={logging} size="sm" variant="secondary">
        Log Visit
      </Button>
    </div>
  );
}
