export type Bookmark = {
  id?: string;
  articleId: string;
  articleTitle?: string;
  note?: string;
  createdAt?: string;
};

export type SavedChart = {
  id: string;
  name: string;
  chartType?: string;
  queryConfig?: unknown;
  createdAt?: string;
};
