export function Spinner({ label = "Loading" }: { label?: string }) {
  return <div className="empty-state">{label}</div>;
}
