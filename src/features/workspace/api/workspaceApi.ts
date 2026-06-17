import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";
import type { Bookmark, SavedChart } from "../../../types/workspace.types";

export const workspaceApi = {
  me: () => httpClient.get(`${endpoints.workspace}/me`),
  bookmarks: () => httpClient.get<Bookmark[]>(`${endpoints.workspace}/bookmarks`),
  addBookmark: (articleId: string, note?: string) => httpClient.post(`${endpoints.workspace}/bookmarks`, { articleId, note }),
  removeBookmark: (articleId: string) => httpClient.delete(`${endpoints.workspace}/bookmarks/${articleId}`),
  savedCharts: () => httpClient.get<SavedChart[]>(`${endpoints.workspace}/saved-charts`),
  saveChart: (payload: { name: string; queryConfig: unknown }) => httpClient.post<SavedChart>(`${endpoints.workspace}/saved-charts`, payload),
  deleteChart: (id: string) => httpClient.delete(`${endpoints.workspace}/saved-charts/${id}`)
};
