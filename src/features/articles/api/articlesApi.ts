import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";
import type { Paged, QueryParams } from "../../../types/api.types";
import type { Article } from "../../../types/catalog.types";

export const articlesApi = {
  list: (params?: QueryParams) => httpClient.get<Paged<Article>>(endpoints.articles, params),
  detail: (id: string, expand = "authors,keywords") => httpClient.get<Article>(`${endpoints.articles}/${id}`, { expand }),
  create: (payload: unknown) => httpClient.post<Article>(endpoints.articles, payload),
  update: (id: string, payload: unknown) => httpClient.put<Article>(`${endpoints.articles}/${id}`, payload),
  remove: (id: string) => httpClient.delete(`${endpoints.articles}/${id}`)
};
