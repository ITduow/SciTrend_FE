export function ChartTooltip({ label, value }: { label: string; value: string | number }) {
  return <span className="tag">{label}: {value}</span>;
}
