import { DataTable } from "../../../shared/components/DataTable";
import type { Article } from "../../../types/catalog.types";

export function ArticleTable({ articles }: { articles: Article[] }) {
  return <DataTable rows={articles as unknown as Record<string, unknown>[]} columns={[{ key: "title", label: "Title" }, { key: "publicationYear", label: "Year" }, { key: "doi", label: "DOI" }]} />;
}
