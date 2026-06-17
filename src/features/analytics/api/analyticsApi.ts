import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";
import type { TrendSeries, WordCloudItem } from "../../../types/analytics.types";

export const analyticsApi = {
  trends: (keywords: string, startYear: number, endYear: number) => httpClient.get<TrendSeries[]>(`${endpoints.analytics}/trends`, { keywords, startYear, endYear }),
  wordCloud: (issueId: string) => httpClient.get<WordCloudItem[]>(`${endpoints.analytics}/word-cloud/${issueId}`),
  growthRate: (keyword: string) => httpClient.get(`${endpoints.analytics}/growth-rate`, { keyword }),
  topTopics: (journalId: string, topN = 20) => httpClient.get(`${endpoints.analytics}/top-topics/${journalId}`, { topN }),
  publicationVolume: (journalId: string, startYear: number, endYear: number) => httpClient.get(`${endpoints.analytics}/publication-volume/${journalId}`, { startYear, endYear }),
  emergingTopics: (subjectAreaId: string, fromYear: number, toYear: number, topN = 20) => httpClient.get(`${endpoints.analytics}/emerging-topics/${subjectAreaId}`, { fromYear, toYear, topN }),
  saturatedTopics: (topN = 20) => httpClient.get(`${endpoints.analytics}/saturated-topics`, { topN }),
  researchGaps: (subjectAreaId: string, topN = 20) => httpClient.get(`${endpoints.analytics}/research-gaps/${subjectAreaId}`, { topN }),
  journalRecommendations: (keyword: string, topN = 10) => httpClient.get(`${endpoints.analytics}/journal-recommendations`, { keyword, topN })
};
