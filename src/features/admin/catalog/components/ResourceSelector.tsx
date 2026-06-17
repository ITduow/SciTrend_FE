import { catalogResources } from "../config/catalogResources";

export function ResourceSelector({ value, onChange }: { value: string; onChange: (resource: string) => void }) {
  return <div className="tab-row">{catalogResources.map((item) => <button key={item.key} className={value === item.key ? "selected" : ""} onClick={() => onChange(item.key)}>{item.label}</button>)}</div>;
}
