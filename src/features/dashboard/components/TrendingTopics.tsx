import { BarChartSvg } from "../../../shared/charts/BarChartSvg";

export function TrendingTopics({ data }: { data: Array<{ label: string; value: number }> }) {
  return <BarChartSvg data={data} />;
}
