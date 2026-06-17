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
  const [json, setJson] = useState("{}");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => { load(); }, [resource]);

  const create = async () => {
    try {
      await api.post(`/api/v1/${resource}`, JSON.parse(json));
      notify("Record created.", "success");
      load();
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
        <Panel title="Create JSON">
          <textarea className="json-editor" value={json} onChange={(e) => setJson(e.target.value)} />
          <button className="primary-button" onClick={create}>Create {resource}</button>
        </Panel>
      </div>
    </section>
  );
}
