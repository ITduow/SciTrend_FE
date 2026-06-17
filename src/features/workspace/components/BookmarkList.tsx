import { DataTable } from "../../../shared/components/DataTable";
import type { Bookmark } from "../../../types/workspace.types";

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  return <DataTable rows={bookmarks as unknown as Record<string, unknown>[]} columns={[{ key: "articleTitle", label: "Article" }, { key: "note", label: "Note" }, { key: "createdAt", label: "Created" }]} />;
}
