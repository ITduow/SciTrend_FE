import type { TrendSeries } from "../../types/analytics.types";
import { EmptyState } from "../components/EmptyState";

export function LineChartSvg({ series }: { series: TrendSeries[] }) {
  const width = 820;
  const height = 280;
  const padding = 34;
  const points = series.flatMap((s) => s.dataPoints);
  if (!points.length) return <EmptyState title="No trend data available" />;
  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  const max = Math.max(1, ...points.map((p) => p.articleCount));
  const colors = ["#2563eb", "#d97706", "#059669", "#be123c", "#7c3aed"];
  const x = (year: number) => padding + (years.indexOf(year) / Math.max(1, years.length - 1)) * (width - padding * 2);
  const y = (count: number) => height - padding - (count / max) * (height - padding * 2);

  return (
    <div className="chart-box">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
        {years.map((year) => <text key={year} x={x(year)} y={height - 9} textAnchor="middle">{year}</text>)}
        {series.map((s, i) => (
          <polyline key={s.keyword} fill="none" stroke={colors[i % colors.length]} strokeWidth="3" points={s.dataPoints.map((p) => `${x(p.year)},${y(p.articleCount)}`).join(" ")} />
        ))}
      </svg>
    </div>
  );
}
