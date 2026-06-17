import { httpClient } from "../../../../api/httpClient";
import type { Paged, QueryParams } from "../../../../types/api.types";
import type { NamedEntity } from "../../../../types/common.types";

export const catalogAdminApi = {
  list: (resource: string, params?: QueryParams) => httpClient.get<Paged<NamedEntity> | NamedEntity[]>(`/api/v1/${resource}`, params),
  create: (resource: string, payload: unknown) => httpClient.post(`/api/v1/${resource}`, payload),
  update: (resource: string, id: string, payload: unknown) => httpClient.put(`/api/v1/${resource}/${id}`, payload),
  remove: (resource: string, id: string) => httpClient.delete(`/api/v1/${resource}/${id}`)
};
