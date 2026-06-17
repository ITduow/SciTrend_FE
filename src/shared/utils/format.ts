import type { ReactNode } from "react";

export function formatCell(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "None";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? `${value.length} items` : "None";
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

export function titleCase(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}
