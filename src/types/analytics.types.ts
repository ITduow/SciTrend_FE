export type TrendSeries = {
  keyword: string;
  dataPoints: Array<{ year: number; articleCount: number }>;
};

export type WordCloudItem = {
  word: string;
  count: number;
  weight: number;
  rank: number;
};
