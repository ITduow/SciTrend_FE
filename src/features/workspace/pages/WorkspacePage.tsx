import { useEffect, useState } from "react";
import { Play, RefreshCw, Trash2, Eye } from "lucide-react";
import { httpClient as api } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { NamedEntity } from "../../../types/common.types";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { compactColumns, toTableRows } from "../../../shared/utils/table";
import { errorMessage } from "../../../shared/utils/errors";
import { Modal } from "../../../shared/components/Modal";
import { Badge } from "../../../shared/components/Badge";

export function WorkspacePage({ notify }: { notify: Notify }) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Article Modal State
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [loadingArticle, setLoadingArticle] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [bookmarkData, chartData] = await Promise.all([
        api.get<any[]>("/api/v1/workspace/bookmarks"),
        api.get<any[]>("/api/v1/workspace/saved-charts")
      ]);
      setBookmarks(bookmarkData);
      setCharts(chartData);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteBookmark = async (articleId: string) => {
    if (!window.confirm("Are you sure you want to remove this bookmark?")) return;
    try {
      await api.delete(`/api/v1/workspace/bookmarks/${articleId}`);
      notify("Bookmark removed.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const deleteChart = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this saved chart?")) return;
    try {
      await api.delete(`/api/v1/workspace/saved-charts/${id}`);
      notify("Saved chart deleted.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const loadChart = (chart: any) => {
    if (chart.queryConfig) {
      sessionStorage.setItem("load_chart_config", typeof chart.queryConfig === 'string' ? chart.queryConfig : JSON.stringify(chart.queryConfig));
      window.location.hash = "analytics";
    }
  };

  const viewArticleDetails = async (articleId: string) => {
    setLoadingArticle(true);
    try {
      const data = await api.get<any>(`/api/v1/articles/${articleId}`, { expand: "authors,keywords" });
      setSelectedArticle(data);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoadingArticle(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="two-column">
        <Panel title="Bookmarked Articles" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
          <DataTable
            loading={loading}
            rows={toTableRows(bookmarks)}
            columns={[
              {
                key: "articleTitle",
                label: "Title",
                render: (row) => (
                  <button className="link-button" onClick={() => viewArticleDetails(String(row.articleId))} style={{ fontWeight: 600 }}>
                    {String(row.articleTitle || "Untitled Article")}
                  </button>
                )
              },
              { key: "note", label: "Note", render: (row) => String(row.note || "No note") },
              { key: "createdAt", label: "Bookmarked At", render: (row) => row.createdAt ? new Date(row.createdAt as string).toLocaleDateString() : "Unknown" },
              {
                key: "id",
                label: "Actions",
                render: (row) => (
                  <div className="workspace-actions">
                    <button className="icon-button" onClick={() => viewArticleDetails(String(row.articleId))} title="View Details"><Eye size={15} /></button>
                    <button className="icon-button danger" onClick={() => deleteBookmark(String(row.articleId))} title="Remove Bookmark"><Trash2 size={15} /></button>
                  </div>
                )
              }
            ]}
          />
        </Panel>

        <Panel title="Saved Charts">
          <DataTable
            loading={loading}
            rows={toTableRows(charts)}
            columns={[
              { key: "name", label: "Name", render: (row) => <strong style={{ color: "var(--text)" }}>{String(row.name)}</strong> },
              {
                key: "queryConfig",
                label: "Chart Query",
                render: (row) => {
                  const cfg = typeof row.queryConfig === "string" ? JSON.parse(row.queryConfig) : (row.queryConfig as any);
                  return cfg ? <span style={{ textTransform: "capitalize", fontSize: "12px", color: "var(--muted)" }}>Type: {cfg.tab || "trends"}</span> : "None";
                }
              },
              { key: "createdAt", label: "Saved At", render: (row) => row.createdAt ? new Date(row.createdAt as string).toLocaleDateString() : "Unknown" },
              {
                key: "id",
                label: "Actions",
                render: (row) => (
                  <div className="workspace-actions">
                    <button className="icon-text" onClick={() => loadChart(row)} title="Load Analysis" style={{ minHeight: "30px", fontSize: "12px" }}>
                      <Play size={13} fill="currentColor" /> Load
                    </button>
                    <button className="icon-button danger" onClick={() => deleteChart(String(row.id))} title="Delete Chart" style={{ minHeight: "30px", width: "30px" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </Panel>
      </div>

      {loadingArticle && (
        <Modal title="Loading article..." onClose={() => {}}>
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Fetching paper metadata...</div>
        </Modal>
      )}

      {selectedArticle && (
        <Modal title="Article Detail" onClose={() => setSelectedArticle(null)}>
          <article className="article-detail">
            <h2>{selectedArticle.title}</h2>
            <p>{selectedArticle.abstract || "No abstract available."}</p>
            <div className="tag-row">
              <Badge value={String(selectedArticle.publicationYear || "Unknown year")} />
              {selectedArticle.doi && <Badge value={selectedArticle.doi} />}
              {selectedArticle.source && <Badge value={selectedArticle.source} />}
            </div>
            
            <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>Keywords</h3>
            <div className="tag-row" style={{ marginTop: "8px" }}>
              {selectedArticle.keywords?.length ? (
                selectedArticle.keywords.map((k: any) => <span className="tag" key={String(k.id || k.word)}>{k.word || k.normalizedWord}</span>)
              ) : (
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>No keywords extracted</span>
              )}
            </div>

            <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginTop: "24px" }}>Authors</h3>
            <div className="tag-row" style={{ marginTop: "8px" }}>
              {selectedArticle.authors?.length ? (
                selectedArticle.authors.map((a: any) => <span className="tag" key={String(a.id || a.fullName)}>{a.fullName || `${a.firstName ?? ""} ${a.lastName ?? ""}`}</span>)
              ) : (
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>No authors listed</span>
              )}
            </div>
          </article>
        </Modal>
      )}
    </div>
  );
}
