import { DataTable } from "../../../shared/components/DataTable";
import type { ExportJob } from "../api/exportsApi";

export function ExportHistoryTable({ jobs }: { jobs: ExportJob[] }) {
  return <DataTable rows={jobs as unknown as Record<string, unknown>[]} columns={[{ key: "jobId", label: "Job" }, { key: "format", label: "Format" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Created" }]} />;
}
