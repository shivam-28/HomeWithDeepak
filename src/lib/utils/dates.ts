import {
  format,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  addDays,
  formatDistanceToNow,
} from "date-fns";
import { Timestamp } from "firebase/firestore";

export function formatDate(timestamp: Timestamp | null): string {
  if (!timestamp) return "—";
  return format(timestamp.toDate(), "dd MMM yyyy");
}

export function formatDateTime(timestamp: Timestamp | null): string {
  if (!timestamp) return "—";
  return format(timestamp.toDate(), "dd MMM yyyy, h:mm a");
}

export function formatRelative(timestamp: Timestamp | null): string {
  if (!timestamp) return "—";
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
}

export function isOverdue(timestamp: Timestamp | null): boolean {
  if (!timestamp) return false;
  return isBefore(timestamp.toDate(), startOfDay(new Date()));
}

export function isTodayDate(timestamp: Timestamp | null): boolean {
  if (!timestamp) return false;
  return isToday(timestamp.toDate());
}

export function isUpcoming(timestamp: Timestamp | null, days: number = 7): boolean {
  if (!timestamp) return false;
  const date = timestamp.toDate();
  const today = startOfDay(new Date());
  const future = addDays(today, days);
  return isAfter(date, today) && isBefore(date, future);
}

export function toInputDateString(date: Date | null): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

export function fromInputDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00");
}
