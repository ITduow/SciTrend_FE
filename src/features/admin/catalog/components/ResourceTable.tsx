import { DataTable } from "../../../../shared/components/DataTable";

export function ResourceTable({ rows }: { rows: Record<string, unknown>[] }) {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row)))).slice(0, 6);
  return <DataTable rows={rows} columns={(keys.length ? keys : ["id"]).map((key) => ({ key, label: key }))} />;
}
