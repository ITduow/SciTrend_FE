import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { httpClient as api, getPagedItems, getApiBaseUrl } from "../../../api/httpClient";
import { getStoredAuth } from "../../../api/tokenStorage";
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
  const [loading, setLoading] = useState(false);

  // Visual Query Builder State (aligns with C# ExportQueryConfig)
  const [filterFromYear, setFilterFromYear] = useState("");
  const [filterToYear, setFilterToYear] = useState("");
  const [filterJournalId, setFilterJournalId] = useState("");
  const [filterKeywords, setFilterKeywords] = useState("");

  // Dropdown Cache
  const [journals, setJournals] = useState<any[]>([]);

  const downloadFile = async (fileId: string, ext: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const auth = getStoredAuth();
      const headers = new Headers();
      if (auth?.accessToken) {
        headers.set("Authorization", `Bearer ${auth.accessToken}`);
      }

      const res = await fetch(`${baseUrl}/api/v1/exports/files/${fileId}`, { headers });
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);

      // Extract actual filename from Content-Disposition header (e.g. scitrend-export-xxx.csv)
      const contentDisposition = res.headers.get("content-disposition");
      let filename = `scitrend-export-${fileId}.${ext}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1].trim();
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notify("Could not download file: " + errorMessage(error), "error");
    }
  };

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

  const loadOptions = async () => {
    try {
      const jRes = await api.get<any>("/api/v1/journals", { page: 1, size: 100 });
      setJournals(getPagedItems(jRes));
    } catch (err) {
      // Non-fatal dropdown loading error
    }
  };

  useEffect(() => {
    load();
    loadOptions();
  }, []);

  const create = async () => {
    try {
      const query = {
        keywords: filterKeywords ? filterKeywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        fromYear: filterFromYear ? Number(filterFromYear) : null,
        toYear: filterToYear ? Number(filterToYear) : null,
        journalId: filterJournalId || null
      };

      const payload = {
        format: format.toUpperCase(), // Backend expects "CSV" or "XLSX"
        query
      };

      await api.post("/api/v1/exports", payload);
      notify("Export job created successfully.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Create Export">
        <div className="query-builder">
          <h3 className="query-builder-title">Export Articles Options & Filters</h3>
          <div className="query-builder-grid">
            <div className="form-group">
              <label>Export Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV Spreadsheet</option>
                <option value="excel">Excel File (XLSX)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Filter by Journal</label>
              <select value={filterJournalId} onChange={(e) => setFilterJournalId(e.target.value)}>
                <option value="">-- All Journals --</option>
                {journals.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Publication Year (From)</label>
              <input type="number" value={filterFromYear} onChange={(e) => setFilterFromYear(e.target.value)} placeholder="e.g. 2018" />
            </div>

            <div className="form-group">
              <label>Publication Year (To)</label>
              <input type="number" value={filterToYear} onChange={(e) => setFilterToYear(e.target.value)} placeholder="e.g. 2025" />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label>Keywords Filter (comma separated, e.g. artificial intelligence, machine learning)</label>
              <input value={filterKeywords} onChange={(e) => setFilterKeywords(e.target.value)} placeholder="Leave blank to export all keywords..." />
            </div>
          </div>
          
          <button className="primary-button" style={{ marginTop: "12px", alignSelf: "flex-end" }} onClick={create}>
            <Download size={16} /> Create Export Job
          </button>
        </div>
      </Panel>

      <Panel title="Export Jobs" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
        <DataTable
          loading={loading}
          rows={toTableRows(jobs)}
          columns={[
            { key: "jobId", label: "Job", render: (row) => String(row.jobId || row.id).slice(0, 8) },
            { key: "format", label: "Format", render: (row) => <span style={{ textTransform: "uppercase", fontWeight: 700 }}>{String(row.format)}</span> },
            { key: "status", label: "Status", render: (row) => <Badge value={String(row.status)} /> },
            { key: "createdAt", label: "Created", render: (row) => row.createdAt ? new Date(row.createdAt as string).toLocaleString() : "Unknown" },
            { key: "fileId", label: "Action", render: (row) => row.fileId ? <button className="icon-text" onClick={() => downloadFile(String(row.fileId), String(row.format).toLowerCase())} style={{ minHeight: "34px" }}><Download size={15} />Download</button> : null }
          ]}
        />
      </Panel>
    </section>
  );
}
