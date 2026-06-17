import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { httpClient as api } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { NamedEntity } from "../../../types/common.types";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { compactColumns, toTableRows } from "../../../shared/utils/table";
import { errorMessage } from "../../../shared/utils/errors";

export function WorkspacePage({ notify }: { notify: Notify }) {
  const [bookmarks, setBookmarks] = useState<NamedEntity[]>([]);
  const [charts, setCharts] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [bookmarkData, chartData] = await Promise.all([
        api.get<NamedEntity[]>("/api/v1/workspace/bookmarks"),
        api.get<NamedEntity[]>("/api/v1/workspace/saved-charts")
      ]);
      setBookmarks(bookmarkData);
      setCharts(chartData);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="two-column">
      <Panel title="Bookmarked Articles" actions={<button className="icon-text" onClick={load}><RefreshCw size={16} />Refresh</button>}>
        <DataTable loading={loading} rows={toTableRows(bookmarks)} columns={compactColumns(["articleTitle", "title", "note", "createdAt"])} />
      </Panel>
      <Panel title="Saved Charts">
        <DataTable loading={loading} rows={toTableRows(charts)} columns={compactColumns(["name", "chartType", "createdAt"])} />
      </Panel>
    </div>
  );
}
