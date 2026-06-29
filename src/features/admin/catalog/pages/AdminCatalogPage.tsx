import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../../api/httpClient";
import type { Notify } from "../../../../app/app.types";
import type { Paged } from "../../../../types/api.types";
import type { NamedEntity } from "../../../../types/common.types";
import { catalogResources } from "../config/catalogResources";
import { Panel } from "../../../../shared/components/Panel";
import { DataTable } from "../../../../shared/components/DataTable";
import { compactColumns, toTableRows } from "../../../../shared/utils/table";
import { errorMessage } from "../../../../shared/utils/errors";

export function AdminCatalogPage({ notify }: { notify: Notify }) {
  const [resource, setResource] = useState(catalogResources[0].key);
  const [rows, setRows] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Dropdown Options
  const [publishers, setPublishers] = useState<any[]>([]);
  const [subjectAreas, setSubjectAreas] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Paged<NamedEntity> | NamedEntity[]>(`/api/v1/${resource}`, { page: 1, size: 50 });
      setRows(getPagedItems(data));
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [pubRes, subRes, jRes, issRes, authRes, kwRes] = await Promise.all([
        api.get<any>("/api/v1/publishers", { page: 1, size: 100 }),
        api.get<any>("/api/v1/subject-areas", { page: 1, size: 100 }),
        api.get<any>("/api/v1/journals", { page: 1, size: 100 }),
        api.get<any>("/api/v1/issues", { page: 1, size: 100 }),
        api.get<any>("/api/v1/authors", { page: 1, size: 100 }),
        api.get<any>("/api/v1/keywords", { page: 1, size: 100 })
      ]);
      setPublishers(getPagedItems(pubRes));
      setSubjectAreas(getPagedItems(subRes));
      setJournals(getPagedItems(jRes));
      setIssues(getPagedItems(issRes));
      setAuthors(getPagedItems(authRes));
      setKeywords(getPagedItems(kwRes));
    } catch (err) {
      // Non-fatal error loading dropdown options
    }
  };

  useEffect(() => {
    load();
    setFormData({});
  }, [resource]);

  useEffect(() => {
    loadOptions();
  }, []);

  const create = async () => {
    try {
      // Validate and clean payload
      const payload: Record<string, any> = { ...formData };
      
      // Clean empty lists or convert strings to numbers
      if (resource === "journals") {
        if (payload.impactFactor) payload.impactFactor = Number(payload.impactFactor);
      } else if (resource === "issues") {
        if (payload.volumeNumber) payload.volumeNumber = Number(payload.volumeNumber);
        if (payload.issueNumber) payload.issueNumber = Number(payload.issueNumber);
        if (payload.publicationYear) payload.publicationYear = Number(payload.publicationYear);
        if (payload.publicationMonth) payload.publicationMonth = Number(payload.publicationMonth);
      } else if (resource === "articles") {
        if (payload.pageStart) payload.pageStart = Number(payload.pageStart);
        if (payload.pageEnd) payload.pageEnd = Number(payload.pageEnd);
        if (payload.publicationYear) payload.publicationYear = Number(payload.publicationYear);
        if (payload.publicationMonth) payload.publicationMonth = Number(payload.publicationMonth);
        if (!payload.authorIds) payload.authorIds = [];
        if (!payload.keywordIds) payload.keywordIds = [];
      }

      await api.post(`/api/v1/${resource}`, payload);
      notify("Record created successfully.", "success");
      setFormData({});
      load();
      loadOptions(); // Refresh dropdown cache
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/api/v1/${resource}/${id}`);
      notify("Record deleted.", "success");
      load();
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  const renderForm = () => {
    switch (resource) {
      case "publishers":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Publisher Name</label>
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Elsevier" />
            </div>
            <div className="form-group">
              <label>Publisher Code</label>
              <input value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. ELS" />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@elsevier.com" />
            </div>
          </div>
        );
      case "journals":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Journal Title</label>
              <input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Journal of AI" />
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>ISSN</label>
                <input value={formData.issn || ""} onChange={(e) => setFormData({ ...formData, issn: e.target.value })} placeholder="1234-5678" />
              </div>
              <div className="form-group">
                <label>E-ISSN</label>
                <input value={formData.eIssn || ""} onChange={(e) => setFormData({ ...formData, eIssn: e.target.value })} placeholder="1234-567X" />
              </div>
            </div>
            <div className="form-group">
              <label>Impact Factor</label>
              <input type="number" step="0.001" value={formData.impactFactor || ""} onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })} placeholder="e.g. 5.4" />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <select value={formData.publisherId || ""} onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}>
                <option value="">-- Select Publisher --</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Subject Area</label>
              <select value={formData.subjectAreaId || ""} onChange={(e) => setFormData({ ...formData, subjectAreaId: e.target.value })}>
                <option value="">-- Select Subject Area --</option>
                {subjectAreas.map((sa) => (
                  <option key={sa.id} value={sa.id}>{sa.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description of the journal..." />
            </div>
          </div>
        );
      case "issues":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Issue Title (Optional)</label>
              <input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Special Issue on Deep Learning" />
            </div>
            <div className="form-group">
              <label>Journal</label>
              <select value={formData.journalId || ""} onChange={(e) => setFormData({ ...formData, journalId: e.target.value })}>
                <option value="">-- Select Journal --</option>
                {journals.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>Volume Number</label>
                <input type="number" value={formData.volumeNumber || ""} onChange={(e) => setFormData({ ...formData, volumeNumber: e.target.value })} placeholder="12" />
              </div>
              <div className="form-group">
                <label>Issue Number</label>
                <input type="number" value={formData.issueNumber || ""} onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })} placeholder="3" />
              </div>
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>Publication Year</label>
                <input type="number" value={formData.publicationYear || ""} onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })} placeholder="2025" />
              </div>
              <div className="form-group">
                <label>Publication Month</label>
                <input type="number" min="1" max="12" value={formData.publicationMonth || ""} onChange={(e) => setFormData({ ...formData, publicationMonth: e.target.value })} placeholder="6" />
              </div>
            </div>
          </div>
        );
      case "articles":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Article Title</label>
              <input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title of the paper..." />
            </div>
            <div className="form-group">
              <label>Issue</label>
              <select value={formData.issueId || ""} onChange={(e) => setFormData({ ...formData, issueId: e.target.value })}>
                <option value="">-- Select Issue --</option>
                {issues.map((i) => (
                  <option key={i.id} value={i.id}>{i.title ? `${i.title} (${i.publicationYear})` : `Vol ${i.volumeNumber} No ${i.issueNumber} (${i.publicationYear})`}</option>
                ))}
              </select>
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>DOI</label>
                <input value={formData.doi || ""} onChange={(e) => setFormData({ ...formData, doi: e.target.value })} placeholder="10.1000/xyz123" />
              </div>
              <div className="form-group">
                <label>Source / Publisher</label>
                <input value={formData.source || ""} onChange={(e) => setFormData({ ...formData, source: e.target.value })} placeholder="e.g. IEEE Explorer" />
              </div>
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>Page Start</label>
                <input type="number" value={formData.pageStart || ""} onChange={(e) => setFormData({ ...formData, pageStart: e.target.value })} placeholder="1" />
              </div>
              <div className="form-group">
                <label>Page End</label>
                <input type="number" value={formData.pageEnd || ""} onChange={(e) => setFormData({ ...formData, pageEnd: e.target.value })} placeholder="15" />
              </div>
            </div>
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>Publication Year</label>
                <input type="number" value={formData.publicationYear || ""} onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })} placeholder="2025" />
              </div>
              <div className="form-group">
                <label>Publication Month</label>
                <input type="number" min="1" max="12" value={formData.publicationMonth || ""} onChange={(e) => setFormData({ ...formData, publicationMonth: e.target.value })} placeholder="6" />
              </div>
            </div>
            <div className="form-group">
              <label>Authors (Hold Ctrl to select multiple)</label>
              <select multiple value={formData.authorIds || []} style={{ height: "100px" }} onChange={(e) => setFormData({ ...formData, authorIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.fullName || `${a.firstName} ${a.lastName}`}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Keywords (Hold Ctrl to select multiple)</label>
              <select multiple value={formData.keywordIds || []} style={{ height: "100px" }} onChange={(e) => setFormData({ ...formData, keywordIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>
                {keywords.map((k) => (
                  <option key={k.id} value={k.id}>{k.word}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Abstract</label>
              <textarea value={formData.abstract || ""} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} placeholder="Abstract of the article..." />
            </div>
          </div>
        );
      case "authors":
        return (
          <div className="catalog-form">
            <div className="catalog-form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input value={formData.firstName || ""} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input value={formData.lastName || ""} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john.doe@university.edu" />
            </div>
            <div className="form-group">
              <label>Affiliation</label>
              <input value={formData.affiliation || ""} onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })} placeholder="Stanford University" />
            </div>
            <div className="form-group">
              <label>ORCID ID</label>
              <input value={formData.orcidId || ""} onChange={(e) => setFormData({ ...formData, orcidId: e.target.value })} placeholder="0000-0002-1825-0097" />
            </div>
          </div>
        );
      case "keywords":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Keyword Word</label>
              <input value={formData.word || ""} onChange={(e) => setFormData({ ...formData, word: e.target.value })} placeholder="e.g. reinforcement learning" />
            </div>
          </div>
        );
      case "subject-areas":
        return (
          <div className="catalog-form">
            <div className="form-group">
              <label>Subject Area Name</label>
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Computer Science" />
            </div>
            <div className="form-group">
              <label>Subject Area Code</label>
              <input value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. COMP" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Catalog Resource">
        <div className="tab-row">
          {catalogResources.map((item) => <button key={item.key} className={resource === item.key ? "selected" : ""} onClick={() => setResource(item.key)}>{item.label}</button>)}
        </div>
      </Panel>
      <div className="two-column wide-left">
        <Panel title="Records" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
          <DataTable
            loading={loading}
            rows={toTableRows(rows)}
            columns={[
              ...compactColumns(["title", "name", "word", "code", "email", "createdAt"]),
              { key: "id", label: "", render: (row) => <button className="icon-button danger" onClick={() => remove(String(row.id))} title="Delete"><X size={16} /></button> }
            ]}
          />
        </Panel>
        <Panel title={`Create ${catalogResources.find(r => r.key === resource)?.label}`}>
          {renderForm()}
          <button className="primary-button" style={{ marginTop: "16px", width: "100%" }} onClick={create}>Create {catalogResources.find(r => r.key === resource)?.label}</button>
        </Panel>
      </div>
    </section>
  );
}
