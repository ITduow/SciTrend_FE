export function Badge({ value }: { value: string }) {
  return <span className={`status ${value.toLowerCase().replace(/\s+/g, "-")}`}>{value}</span>;
}
