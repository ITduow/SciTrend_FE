import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { LineChartSvg } from "./LineChartSvg";
import { WordCloudSvg } from "./WordCloudSvg";
import { BarChartSvg } from "./BarChartSvg";
import type { TrendSeries, WordCloudItem } from "../../types/analytics.types";
import type { NamedEntity } from "../../types/common.types";
import { deriveColumns, toTableRows } from "../utils/table";

export function AnalyticsResult({ tab, data }: { tab: string; data: unknown }) {
  if (tab === "trends") return <LineChartSvg series={data as TrendSeries[]} />;
  if (tab === "word-cloud") return <WordCloudSvg data={data as WordCloudItem[]} />;
  if (Array.isArray(data)) {
    return <DataTable rows={toTableRows(data)} columns={deriveColumns(data as NamedEntity[])} />;
  }
  if (typeof data === "object" && data && "dataPoints" in data) {
    const points = (data as { dataPoints: Array<Record<string, unknown>> }).dataPoints;
    return (
      <BarChartSvg
        data={points.map((row, index) => ({
          label: String(row.keyword ?? row.year ?? row.month ?? `Item ${index + 1}`),
          value: Number(row.count ?? row.articleCount ?? 0)
        }))}
      />
    );
  }
  if (typeof data === "object" && data) {
    const row = data as NamedEntity;
    return <DataTable rows={[row]} columns={deriveColumns([row])} />;
  }
  return <EmptyState title="No analytics data available" />;
}
