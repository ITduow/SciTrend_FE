import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { httpClient as api } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { ExportJob } from "../api/exportsApi";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { Badge } from "../../../shared/components/Badge";
import { errorMessage } from "../../../shared/utils/errors";
import { toTableRows } from "../../../shared/utils/table";

export function ExportsPage({ notify }: { notify: Notify }) {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [format, setFormat] = useState("csv");
  const [queryJson, setQueryJson] = useState('{"type":"articles","filters":{}}');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setJobs(await api.get<ExportJob[]>("/api/v1/exports"));
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api.post("/api/v1/exports", { format, query: JSON.parse(queryJson) });
      notify("Export job created.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Create Export">
        <div className="filter-row align-end">
          <label>Format<select value={format} onChange={(e) => setFormat(e.target.value)}><option value="csv">CSV</option><option value="xlsx">XLSX</option></select></label>
          <label className="wide">Query JSON<textarea value={queryJson} onChange={(e) => setQueryJson(e.target.value)} /></label>
          <button className="primary-button compact" onClick={create}><Download size={16} />Create</button>
        </div>
      </Panel>
      <Panel title="Export Jobs" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
        <DataTable
          loading={loading}
          rows={toTableRows(jobs)}
          columns={[
            { key: "jobId", label: "Job", render: (row) => String(row.jobId || row.id) },
            { key: "format", label: "Format" },
            { key: "status", label: "Status", render: (row) => <Badge value={String(row.status)} /> },
            { key: "createdAt", label: "Created" },
            { key: "fileId", label: "", render: (row) => row.fileId ? <a className="icon-text" href={api.downloadUrl(`/api/v1/exports/files/${row.fileId}`)}><Download size={16} />Download</a> : null }
          ]}
        />
      </Panel>
    </section>
  );
}
