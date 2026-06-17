import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";
import type { Paged, QueryParams } from "../../../types/api.types";
import type { Journal } from "../../../types/catalog.types";

export const journalsApi = {
  list: (params?: QueryParams) => httpClient.get<Paged<Journal>>(endpoints.journals, params),
  detail: (id: string) => httpClient.get<Journal>(`${endpoints.journals}/${id}`)
};
