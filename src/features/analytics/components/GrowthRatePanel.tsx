import { DataTable } from "../../../shared/components/DataTable";
export function GrowthRatePanel({ data }: { data: Record<string, unknown> }) {
  return <DataTable rows={[data]} columns={Object.keys(data).map((key) => ({ key, label: key }))} />;
}
