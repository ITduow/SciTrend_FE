import { DataTable } from "../../../shared/components/DataTable";
export function TopTopicsPanel({ rows }: { rows: Record<string, unknown>[] }) {
  return <DataTable rows={rows} columns={[{ key: "keyword", label: "Keyword" }, { key: "articleCount", label: "Articles" }, { key: "rank", label: "Rank" }]} />;
}
