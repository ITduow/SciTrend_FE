import { LineChartSvg } from "../../../shared/charts/LineChartSvg";
import type { TrendSeries } from "../../../types/analytics.types";

export function TrendChartPanel({ series }: { series: TrendSeries[] }) {
  return <LineChartSvg series={series} />;
}
