import { useEffect, useState } from "react";
import { Bookmark, RefreshCw, Search } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { Paged, QueryParams } from "../../../types/api.types";
import type { Article } from "../../../types/catalog.types";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { Pagination } from "../../../shared/components/Pagination";
import { Badge } from "../../../shared/components/Badge";
import { Modal } from "../../../shared/components/Modal";
import { errorMessage } from "../../../shared/utils/errors";
import { toTableRows } from "../../../shared/utils/table";

export function ArticlesPage({ notify }: { notify: Notify }) {
  const [query, setQuery] = useState({ page: 1, size: 10, year: "", journalId: "", hasKeywords: "" });
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Article | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params: QueryParams = { page: query.page, size: query.size, expand: "authors,keywords" };
      if (query.year) params.year = query.year;
      if (query.journalId) params.journalId = query.journalId;
      if (query.hasKeywords) params.hasKeywords = query.hasKeywords === "true";
      const data = await api.get<Paged<Article>>("/api/v1/articles", params);
      setArticles(getPagedItems(data));
      setTotal(data.pagination?.totalItems ?? 0);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [query.page, query.size]);

  const bookmark = async (articleId: string) => {
    try {
      await api.post("/api/v1/workspace/bookmarks", { articleId });
      notify("Article bookmarked.", "success");
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Article Discovery" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
        <div className="filter-row">
          <label>Year<input value={query.year} onChange={(e) => setQuery({ ...query, year: e.target.value })} placeholder="2025" /></label>
          <label>Journal ID<input value={query.journalId} onChange={(e) => setQuery({ ...query, journalId: e.target.value })} placeholder="uuid" /></label>
          <label>Keywords
            <select value={query.hasKeywords} onChange={(e) => setQuery({ ...query, hasKeywords: e.target.value })}>
              <option value="">Any</option>
              <option value="true">Has keywords</option>
              <option value="false">Missing keywords</option>
            </select>
          </label>
          <button className="primary-button compact" onClick={() => { setQuery({ ...query, page: 1 }); window.setTimeout(load, 0); }}>
            <Search size={16} />Search
          </button>
        </div>
        <DataTable
          loading={loading}
          rows={toTableRows(articles)}
          columns={[
            { key: "title", label: "Title", render: (row) => <button className="link-button" onClick={() => setSelected(row as Article)}>{String(row.title)}</button> },
            { key: "publicationYear", label: "Year" },
            { key: "journalTitle", label: "Journal", render: (row) => String(row.journalTitle || row.journalId || "Unknown") },
            { key: "doi", label: "DOI", render: (row) => String(row.doi || "None") },
            { key: "status", label: "Status", render: (row) => <Badge value={String(row.status || "Published")} /> },
            { key: "id", label: "", render: (row) => <button className="icon-button" onClick={() => bookmark(String(row.id))} title="Bookmark"><Bookmark size={16} /></button> }
          ]}
        />
        <Pagination page={query.page} size={query.size} total={total} onPage={(page) => setQuery({ ...query, page })} />
      </Panel>
      {selected && (
        <Modal title="Article Detail" onClose={() => setSelected(null)}>
          <article className="article-detail">
            <h2>{selected.title}</h2>
            <p>{selected.abstract || "No abstract available."}</p>
            <div className="tag-row">
              <Badge value={String(selected.publicationYear || "Unknown year")} />
              {selected.doi && <Badge value={selected.doi} />}
              {selected.source && <Badge value={selected.source} />}
            </div>
            <h3>Keywords</h3>
            <div className="tag-row">{selected.keywords?.length ? selected.keywords.map((k) => <span className="tag" key={String(k.id || k.word)}>{k.word || k.normalizedWord}</span>) : "No keywords"}</div>
            <h3>Authors</h3>
            <div className="tag-row">{selected.authors?.length ? selected.authors.map((a) => <span className="tag" key={String(a.id || a.fullName)}>{a.fullName || `${a.firstName ?? ""} ${a.lastName ?? ""}`}</span>) : "No authors"}</div>
          </article>
        </Modal>
      )}
    </section>
  );
}
