import { DataTable } from "../../../shared/components/DataTable";
import type { Journal } from "../../../types/catalog.types";

export function JournalTable({ journals }: { journals: Journal[] }) {
  return <DataTable rows={journals as unknown as Record<string, unknown>[]} columns={[{ key: "title", label: "Title" }, { key: "issn", label: "ISSN" }, { key: "impactFactor", label: "Impact" }]} />;
}
