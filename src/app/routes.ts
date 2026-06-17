import type { Role } from "../types/auth.types";

export type RouteKey =
  | "dashboard"
  | "articles"
  | "journals"
  | "analytics"
  | "workspace"
  | "exports"
  | "admin-ingestion"
  | "admin-catalog"
  | "settings";

export type AppRoute = {
  key: RouteKey;
  path: string;
  label: string;
  roles?: Role[];
};

export const routes: AppRoute[] = [
  { key: "dashboard", path: "/", label: "Dashboard" },
  { key: "articles", path: "/articles", label: "Articles" },
  { key: "journals", path: "/journals", label: "Journals" },
  { key: "analytics", path: "/analytics", label: "Analytics" },
  { key: "workspace", path: "/workspace", label: "Workspace" },
  { key: "exports", path: "/exports", label: "Exports" },
  { key: "admin-ingestion", path: "/admin/ingestion", label: "Ingestion", roles: ["SystemAdmin"] },
  { key: "admin-catalog", path: "/admin/catalog", label: "Catalog Admin", roles: ["SystemAdmin"] },
  { key: "settings", path: "/settings", label: "Settings" }
];
