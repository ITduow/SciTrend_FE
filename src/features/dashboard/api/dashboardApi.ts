import { httpClient } from "../../../api/httpClient";
import type { Paged } from "../../../types/api.types";
import type { Article } from "../../../types/catalog.types";
import type { NamedEntity } from "../../../types/common.types";

export const dashboardApi = {
  articles: () => httpClient.get<Paged<Article>>("/api/v1/articles", { page: 1, size: 1 }),
  journals: () => httpClient.get<Paged<NamedEntity>>("/api/v1/journals", { page: 1, size: 1 }),
  keywords: () => httpClient.get<Paged<NamedEntity>>("/api/v1/keywords", { page: 1, size: 1 })
};
