import type { Article } from "../../../types/catalog.types";

export function ArticleDetailCard({ article }: { article: Article }) {
  return <article className="article-detail"><h2>{article.title}</h2><p>{article.abstract || "No abstract available."}</p></article>;
}
