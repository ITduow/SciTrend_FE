import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
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

  // Visual Query Builder State
  const [exportType, setExportType] = useState("articles");
  const [filterYear, setFilterYear] = useState("");
  const [filterJournalId, setFilterJournalId] = useState("");
  const [filterHasKeywords, setFilterHasKeywords] = useState("");
  const [filterPublisherId, setFilterPublisherId] = useState("");
  const [filterSubjectAreaId, setFilterSubjectAreaId] = useState("");

  // Dropdown Cache
  const [journals, setJournals] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [subjectAreas, setSubjectAreas] = useState<any[]>([]);

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
      const [jRes, pubRes, subRes] = await Promise.all([
        api.get<any>("/api/v1/journals", { page: 1, size: 100 }),
        api.get<any>("/api/v1/publishers", { page: 1, size: 100 }),
        api.get<any>("/api/v1/subject-areas", { page: 1, size: 100 })
      ]);
      setJournals(getPagedItems(jRes));
      setPublishers(getPagedItems(pubRes));
      setSubjectAreas(getPagedItems(subRes));
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
      const filters: Record<string, any> = {};
      
      if (exportType === "articles") {
        if (filterYear) filters.year = Number(filterYear);
        if (filterJournalId) filters.journalId = filterJournalId;
        if (filterHasKeywords !== "") filters.hasKeywords = filterHasKeywords === "true";
      } else if (exportType === "journals") {
        if (filterPublisherId) filters.publisherId = filterPublisherId;
        if (filterSubjectAreaId) filters.subjectAreaId = filterSubjectAreaId;
      }

      const query = {
        type: exportType,
        filters
      };

      await api.post("/api/v1/exports", { format, query });
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
          <h3 className="query-builder-title">Export Options & Filters</h3>
          <div className="query-builder-grid">
            <div className="form-group">
              <label>Export Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV Spreadsheet</option>
                <option value="xlsx">Excel File (XLSX)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Data Entity Type</label>
              <select value={exportType} onChange={(e) => setExportType(e.target.value)}>
                <option value="articles">Articles</option>
                <option value="journals">Journals</option>
                <option value="keywords">Keywords</option>
              </select>
            </div>

            {exportType === "articles" && (
              <>
                <div className="form-group">
                  <label>Filter Year</label>
                  <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} placeholder="e.g. 2025" />
                </div>
                <div className="form-group">
                  <label>Filter Journal</label>
                  <select value={filterJournalId} onChange={(e) => setFilterJournalId(e.target.value)}>
                    <option value="">-- All Journals --</option>
                    {journals.map((j) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Keywords Status</label>
                  <select value={filterHasKeywords} onChange={(e) => setFilterHasKeywords(e.target.value)}>
                    <option value="">-- Any --</option>
                    <option value="true">Has Keywords</option>
                    <option value="false">Missing Keywords</option>
                  </select>
                </div>
              </>
            )}

            {exportType === "journals" && (
              <>
                <div className="form-group">
                  <label>Filter Publisher</label>
                  <select value={filterPublisherId} onChange={(e) => setFilterPublisherId(e.target.value)}>
                    <option value="">-- All Publishers --</option>
                    {publishers.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Filter Subject Area</label>
                  <select value={filterSubjectAreaId} onChange={(e) => setFilterSubjectAreaId(e.target.value)}>
                    <option value="">-- All Subject Areas --</option>
                    {subjectAreas.map((sa) => (
                      <option key={sa.id} value={sa.id}>{sa.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
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
            { key: "fileId", label: "Action", render: (row) => row.fileId ? <a className="icon-text" href={api.downloadUrl(`/api/v1/exports/files/${row.fileId}`)}><Download size={16} />Download</a> : null }
          ]}
        />
      </Panel>
    </section>
  );
}
