import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, Search } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
import type { Paged } from "../../../types/api.types";
import type { NamedEntity } from "../../../types/common.types";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { Pagination } from "../../../shared/components/Pagination";
import { Modal } from "../../../shared/components/Modal";
import { Badge } from "../../../shared/components/Badge";
import { errorMessage } from "../../../shared/utils/errors";
import { toTableRows } from "../../../shared/utils/table";

export function JournalsPage({ resource = "journals", title = "Journals" }: { resource?: string; title?: string }) {
  const [rows, setRows] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [subjectAreaId, setSubjectAreaId] = useState("");

  // Options Cache
  const [publishers, setPublishers] = useState<any[]>([]);
  const [subjectAreas, setSubjectAreas] = useState<any[]>([]);

  // Journal Detail State
  const [selectedJournal, setSelectedJournal] = useState<any | null>(null);
  const [journalIssues, setJournalIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);

  const loadOptions = async () => {
    try {
      const [pubRes, subRes] = await Promise.all([
        api.get<any>("/api/v1/publishers", { page: 1, size: 100 }),
        api.get<any>("/api/v1/subject-areas", { page: 1, size: 100 })
      ]);
      setPublishers(getPagedItems(pubRes));
      setSubjectAreas(getPagedItems(subRes));
    } catch {
      // Non-fatal options loading error
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, size };
      if (searchQuery) params.search = searchQuery;
      if (publisherId) params.publisherId = publisherId;
      if (subjectAreaId) params.subjectAreaId = subjectAreaId;

      const data = await api.get<Paged<any> | any[]>(`/api/v1/${resource}`, params);
      
      // Safe check if paginated envelope
      if (data && typeof data === "object" && "pagination" in data) {
        setRows(getPagedItems(data));
        setTotal((data as Paged<any>).pagination?.totalItems ?? 0);
      } else {
        const items = getPagedItems(data);
        setRows(items);
        setTotal(items.length);
      }
    } catch (err) {
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, size]);

  useEffect(() => {
    loadOptions();
  }, []);

  const triggerSearch = () => {
    setPage(1);
    // Execute load next tick
    window.setTimeout(load, 0);
  };

  const viewJournalDetails = async (journal: any) => {
    setSelectedJournal(journal);
    setLoadingIssues(true);
    try {
      const issues = await api.get<any[]>(`/api/v1/journals/${journal.id}/issues`);
      setJournalIssues(issues || []);
    } catch (err) {
      setJournalIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  return (
    <section className="page-stack">
      <Panel title={title} actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
        {/* Filter Row */}
        <div className="filter-row">
          <label style={{ flex: "1 1 200px" }}>
            Search Title/ISSN
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type keyword..." onKeyDown={(e) => e.key === "Enter" && triggerSearch()} />
          </label>
          <label>
            Publisher
            <select value={publisherId} onChange={(e) => setPublisherId(e.target.value)}>
              <option value="">-- All Publishers --</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            Subject Area
            <select value={subjectAreaId} onChange={(e) => setSubjectAreaId(e.target.value)}>
              <option value="">-- All Subject Areas --</option>
              {subjectAreas.map((sa) => (
                <option key={sa.id} value={sa.id}>{sa.name}</option>
              ))}
            </select>
          </label>
          <button className="primary-button compact" onClick={triggerSearch} style={{ minHeight: "40px" }}>
            <Search size={16} /> Search
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          loading={loading}
          rows={toTableRows(rows)}
          columns={[
            {
              key: "title",
              label: "Journal Title",
              render: (row) => (
                <button className="link-button" onClick={() => viewJournalDetails(row)} style={{ fontWeight: 600 }}>
                  {String(row.title || row.name || "Unknown Title")}
                </button>
              )
            },
            { key: "issn", label: "ISSN", render: (row) => String(row.issn || "None") },
            { key: "eissn", label: "E-ISSN", render: (row) => String(row.eIssn || row.eissn || "None") },
            { key: "impactFactor", label: "Impact Factor", render: (row) => row.impactFactor !== undefined ? Number(row.impactFactor).toFixed(3) : "N/A" },
            { key: "description", label: "Description", render: (row) => String(row.description || "").slice(0, 70) + (String(row.description || "").length > 70 ? "..." : "") }
          ]}
        />

        {/* Pagination */}
        <Pagination page={page} size={size} total={total} onPage={setPage} />
      </Panel>

      {/* Journal Issues Details Modal */}
      {selectedJournal && (
        <Modal title="Journal Detail" onClose={() => setSelectedJournal(null)}>
          <article className="article-detail">
            <h2>{selectedJournal.title}</h2>
            {selectedJournal.description && <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: "16px" }}>{selectedJournal.description}</p>}
            
            <div className="tag-row" style={{ marginBottom: "20px" }}>
              {selectedJournal.issn && <Badge value={`ISSN: ${selectedJournal.issn}`} />}
              {selectedJournal.eIssn && <Badge value={`E-ISSN: ${selectedJournal.eIssn}`} />}
              {selectedJournal.impactFactor !== undefined && <Badge value={`Impact Factor: ${Number(selectedJournal.impactFactor).toFixed(3)}`} />}
            </div>

            <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "12px" }}>Published Issues</h3>
            
            {loadingIssues ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>Loading issues list...</div>
            ) : journalIssues.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>No issues published in this journal yet.</div>
            ) : (
              <div className="table-wrap">
                <table style={{ minWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Volume</th>
                      <th>Issue</th>
                      <th>Year</th>
                      <th>Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journalIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td>{issue.title || "Regular Issue"}</td>
                        <td>Vol {issue.volumeNumber || "N/A"}</td>
                        <td>No {issue.issueNumber || "N/A"}</td>
                        <td><strong>{issue.publicationYear}</strong></td>
                        <td>{issue.publicationMonth || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </Modal>
      )}
    </section>
  );
}
