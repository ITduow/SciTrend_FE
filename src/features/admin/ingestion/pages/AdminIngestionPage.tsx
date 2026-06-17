import { useEffect, useState } from "react";
import { Gauge, RefreshCw, Upload } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../../api/httpClient";
import type { Notify } from "../../../../app/app.types";
import type { Paged } from "../../../../types/api.types";
import type { NamedEntity } from "../../../../types/common.types";
import type { BatchJob } from "../api/ingestionApi";
import { Panel } from "../../../../shared/components/Panel";
import { DataTable } from "../../../../shared/components/DataTable";
import { Badge } from "../../../../shared/components/Badge";
import { compactColumns, toTableRows } from "../../../../shared/utils/table";
import { errorMessage } from "../../../../shared/utils/errors";

export function AdminIngestionPage({ notify }: { notify: Notify }) {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [logs, setLogs] = useState<NamedEntity[]>([]);
  const [queries, setQueries] = useState<NamedEntity[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [jobData, queryData] = await Promise.all([
        api.get<Paged<BatchJob>>("/api/v1/ingest/jobs", { page: 1, size: 50 }),
        api.get<NamedEntity[]>("/api/v1/ingest/crawler-queries")
      ]);
      setJobs(getPagedItems(jobData));
      setQueries(queryData);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file) return notify("Choose a file first.", "info");
    const form = new FormData();
    form.append("file", file);
    try {
      await api.post("/api/v1/ingest/batches", form);
      notify("Batch uploaded.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const trigger = async (path: string, message: string) => {
    try {
      await api.post(path);
      notify(message, "success");
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const loadLogs = async (jobId: string) => {
    setSelectedJob(jobId);
    try {
      setLogs(await api.get<NamedEntity[]>(`/api/v1/ingest/jobs/${jobId}/logs`));
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Batch Upload">
        <div className="filter-row align-end">
          <label className="wide">File<input type="file" accept=".csv,.xlsx,.xls,.json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
          <button className="primary-button compact" onClick={upload}><Upload size={16} />Upload</button>
          <button className="icon-text" onClick={() => trigger("/api/v1/ingest/crawler-jobs", "Crawler job queued.")}><RefreshCw size={16} />Crawler</button>
          <button className="icon-text" onClick={() => trigger("/api/v1/ingest/extraction-jobs", "Keyword extraction queued.")}><Gauge size={16} />Extract</button>
        </div>
      </Panel>
      <div className="two-column">
        <Panel title="Batch Jobs" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
          <DataTable
            loading={loading}
            rows={toTableRows(jobs)}
            columns={[
              { key: "fileName", label: "File" },
              { key: "status", label: "Status", render: (row) => <Badge value={String(row.status)} /> },
              { key: "processedRecords", label: "Processed" },
              { key: "failedRecords", label: "Failed" },
              { key: "id", label: "", render: (row) => <button className="link-button" onClick={() => loadLogs(String(row.id))}>Logs</button> }
            ]}
          />
        </Panel>
        <Panel title={selectedJob ? `Logs ${selectedJob.slice(0, 8)}` : "Crawler Queries"}>
          {selectedJob ? (
            <DataTable rows={toTableRows(logs)} columns={compactColumns(["level", "message", "recordIndex", "createdAt"])} />
          ) : (
            <DataTable loading={loading} rows={toTableRows(queries)} columns={compactColumns(["name", "query", "source", "isActive"])} />
          )}
        </Panel>
      </div>
    </section>
  );
}
