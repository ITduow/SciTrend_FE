import type { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="app-shell">{children}</div>;
}
