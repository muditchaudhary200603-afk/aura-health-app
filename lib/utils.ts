import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatClinicHours(open: string | null, close: string | null, status: string) {
  if (status === "Emergency Only") {
    return status;
  }

  return `${open} - ${close}`;
}

export function slugToLabel(value?: string | null) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPreferredDate(value?: string | null) {
  if (!value) {
    return "Date flexible";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}
