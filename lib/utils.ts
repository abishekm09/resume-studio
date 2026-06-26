import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2023-06" -> "Jun 2023". Empty -> "". */
export function formatMonth(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function dateRange(start: string, end: string, current: boolean): string {
  const from = formatMonth(start);
  const to = current ? "Present" : formatMonth(end);
  if (!from && !to) return "";
  if (!from) return to;
  if (!to) return from;
  return `${from} \u2013 ${to}`;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
