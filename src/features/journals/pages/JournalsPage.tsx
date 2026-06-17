import { useEffect, useState } from "react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
import type { Paged } from "../../../types/api.types";
import type { NamedEntity } from "../../../types/common.types";
import { Panel } from "../../../shared/components/Panel";
import { DataTable } from "../../../shared/components/DataTable";
import { compactColumns, toTableRows } from "../../../shared/utils/table";

export function JournalsPage({ resource = "journals", title = "Journals" }: { resource?: string; title?: string }) {
  const [rows, setRows] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<Paged<NamedEntity> | NamedEntity[]>(`/api/v1/${resource}`, { page: 1, size: 25 })
      .then((data) => setRows(getPagedItems(data)))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [resource]);

  return (
    <Panel title={title}>
      <DataTable loading={loading} rows={toTableRows(rows)} columns={compactColumns(["title", "name", "issn", "code", "country", "createdAt"])} />
    </Panel>
  );
}
