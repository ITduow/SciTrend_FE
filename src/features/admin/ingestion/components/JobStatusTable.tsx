import { DataTable } from "../../../../shared/components/DataTable";
import type { BatchJob } from "../api/ingestionApi";

export function JobStatusTable({ jobs }: { jobs: BatchJob[] }) {
  return <DataTable rows={jobs as unknown as Record<string, unknown>[]} columns={[{ key: "fileName", label: "File" }, { key: "status", label: "Status" }, { key: "processedRecords", label: "Processed" }, { key: "failedRecords", label: "Failed" }]} />;
}
