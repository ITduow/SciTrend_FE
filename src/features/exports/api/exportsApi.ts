import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";

export type ExportJob = {
  jobId?: string;
  id?: string;
  status: string;
  format?: string;
  fileId?: string | null;
  createdAt?: string;
};

export const exportsApi = {
  list: () => httpClient.get<ExportJob[]>(endpoints.exports),
  create: (payload: { format: string; query: unknown }) => httpClient.post<ExportJob>(endpoints.exports, payload),
  detail: (jobId: string) => httpClient.get<ExportJob>(`${endpoints.exports}/${jobId}`),
  fileUrl: (fileId: string) => httpClient.downloadUrl(`${endpoints.exports}/files/${fileId}`)
};
