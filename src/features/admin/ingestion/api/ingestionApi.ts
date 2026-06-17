import { endpoints } from "../../../../api/endpoints";
import { httpClient } from "../../../../api/httpClient";
import type { Paged } from "../../../../types/api.types";
import type { NamedEntity } from "../../../../types/common.types";

export type BatchJob = {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  totalRecords?: number;
  processedRecords?: number;
  failedRecords?: number;
};

export const ingestionApi = {
  uploadBatch: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return httpClient.post(`${endpoints.ingest}/batches`, form);
  },
  jobs: () => httpClient.get<Paged<BatchJob>>(`${endpoints.ingest}/jobs`, { page: 1, size: 50 }),
  logs: (jobId: string) => httpClient.get<NamedEntity[]>(`${endpoints.ingest}/jobs/${jobId}/logs`),
  crawlerQueries: () => httpClient.get<NamedEntity[]>(`${endpoints.ingest}/crawler-queries`),
  triggerCrawler: () => httpClient.post(`${endpoints.ingest}/crawler-jobs`),
  triggerExtraction: () => httpClient.post(`${endpoints.ingest}/extraction-jobs`)
};
