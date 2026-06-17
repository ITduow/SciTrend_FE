import type { ReactNode } from "react";
import { MetricCard } from "../../../shared/charts/MetricCard";

export function DashboardStats({ items }: { items: Array<{ icon: ReactNode; label: string; value: number }> }) {
  return <div className="metric-grid">{items.map((item) => <MetricCard key={item.label} {...item} />)}</div>;
}
