import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Database,
  FileSpreadsheet,
  FolderKanban,
  Home,
  Settings,
  Shield,
  Upload
} from "lucide-react";
import type { RouteKey } from "./routes";

export type NavItem = {
  key: RouteKey;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { key: "articles", label: "Articles", icon: <BookOpen size={18} /> },
  { key: "journals", label: "Journals", icon: <Database size={18} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { key: "workspace", label: "Workspace", icon: <FolderKanban size={18} /> },
  { key: "exports", label: "Exports", icon: <FileSpreadsheet size={18} /> },
  { key: "admin-ingestion", label: "Ingestion", icon: <Upload size={18} />, adminOnly: true },
  { key: "admin-catalog", label: "Catalog Admin", icon: <Shield size={18} />, adminOnly: true },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> }
];
