import { DataTable } from "../../../shared/components/DataTable";
import type { SavedChart } from "../../../types/workspace.types";

export function SavedChartList({ charts }: { charts: SavedChart[] }) {
  return <DataTable rows={charts as unknown as Record<string, unknown>[]} columns={[{ key: "name", label: "Name" }, { key: "chartType", label: "Type" }, { key: "createdAt", label: "Created" }]} />;
}
