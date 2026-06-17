import { DataTable } from "../../../../shared/components/DataTable";

export function IngestionLogs({ rows }: { rows: Record<string, unknown>[] }) {
  return <DataTable rows={rows} columns={[{ key: "level", label: "Level" }, { key: "message", label: "Message" }, { key: "createdAt", label: "Created" }]} />;
}
