import type { Journal } from "../../../types/catalog.types";

export function JournalProfile({ journal }: { journal: Journal }) {
  return <article className="article-detail"><h2>{journal.title}</h2><p>{journal.issn || "No ISSN"}</p></article>;
}
