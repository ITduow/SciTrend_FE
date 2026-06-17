import type { Article } from "../../../types/catalog.types";
import { DataTable } from "../../../shared/components/DataTable";

export function RecentArticles({ articles }: { articles: Article[] }) {
  return <DataTable rows={articles as unknown as Record<string, unknown>[]} columns={[{ key: "title", label: "Title" }, { key: "publicationYear", label: "Year" }]} />;
}
