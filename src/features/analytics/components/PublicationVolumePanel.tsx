import { BarChartSvg } from "../../../shared/charts/BarChartSvg";
export function PublicationVolumePanel({ points }: { points: Array<{ year?: number; month?: number; count: number }> }) {
  return <BarChartSvg data={points.map((p) => ({ label: `${p.year ?? ""}${p.month ? `/${p.month}` : ""}`, value: p.count }))} />;
}
