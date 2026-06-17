import type { ReactNode } from "react";

export function MetricCard({ icon, label, value, loading }: { icon: ReactNode; label: string; value: number; loading?: boolean }) {
  return <div className="metric"><div>{icon}</div><span>{label}</span><strong>{loading ? "..." : value.toLocaleString()}</strong></div>;
}
