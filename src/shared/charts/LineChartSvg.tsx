import { useState } from "react";
import type { TrendSeries } from "../../types/analytics.types";
import { EmptyState } from "../components/EmptyState";

export function LineChartSvg({ series }: { series: TrendSeries[] }) {
  const [hovered, setHovered] = useState<{
    year: number;
    keyword: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const width = 820;
  const height = 280;
  const padding = 44;
  const points = series.flatMap((s) => s.dataPoints);
  
  if (!points.length) return <EmptyState title="No trend data available" />;
  
  const years = Array.from(new Set(points.map((p) => p.year))).sort();
  const max = Math.max(1, ...points.map((p) => p.articleCount));
  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  
  const x = (year: number) => padding + (years.indexOf(year) / Math.max(1, years.length - 1)) * (width - padding * 2);
  const y = (count: number) => height - padding - (count / max) * (height - padding * 2);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="chart-box" style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" style={{ overflow: "visible" }}>
        {/* Horizontal Gridlines & Y axis labels */}
        {yTicks.map((tick, index) => {
          const yVal = height - padding - tick * (height - padding * 2);
          const countVal = Math.round(tick * max);
          return (
            <g key={index}>
              <line x1={padding} y1={yVal} x2={width - padding} y2={yVal} className="grid-line" />
              <text x={padding - 10} y={yVal + 4} textAnchor="end" style={{ fill: "var(--muted)", fontSize: "11px" }}>{countVal}</text>
            </g>
          );
        })}

        {/* X and Y Axes lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} style={{ stroke: "var(--line)" }} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} style={{ stroke: "var(--line)" }} />

        {/* X axis labels (Years) */}
        {years.map((year) => (
          <text key={year} x={x(year)} y={height - 18} textAnchor="middle" style={{ fill: "var(--muted)", fontSize: "11px", fontWeight: 600 }}>
            {year}
          </text>
        ))}

        {/* Shaded Areas and Trend Lines */}
        {series.map((s, i) => {
          const color = colors[i % colors.length];
          const sortedData = [...s.dataPoints].sort((a, b) => a.year - b.year);
          if (sortedData.length === 0) return null;
          
          const pointsString = sortedData.map((p) => `${x(p.year)},${y(p.articleCount)}`).join(" ");
          const firstPoint = sortedData[0];
          const lastPoint = sortedData[sortedData.length - 1];
          const areaPoints = `${x(firstPoint.year)},${height - padding} ${pointsString} ${x(lastPoint.year)},${height - padding}`;

          return (
            <g key={s.keyword}>
              {/* Trend Area under line */}
              <polygon points={areaPoints} fill={color} className="chart-area-under" />
              
              {/* Trend Line */}
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                className="chart-line"
                points={pointsString}
              />

              {/* Data points (dots) */}
              {sortedData.map((p) => (
                <circle
                  key={p.year}
                  cx={x(p.year)}
                  cy={y(p.articleCount)}
                  r="5"
                  stroke={color}
                  className="chart-dot"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (rect && svgRect) {
                      setHovered({
                        year: p.year,
                        keyword: s.keyword,
                        count: p.articleCount,
                        x: rect.left - svgRect.left + 5,
                        y: rect.top - svgRect.top - 58
                      });
                    }
                  }}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${hovered.x}px`,
            top: `${hovered.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <strong>{hovered.keyword}</strong>
          <span>Articles: {hovered.count}</span>
          <span>Year: {hovered.year}</span>
        </div>
      )}

      {/* Legend */}
      <div className="legend" style={{ marginTop: "16px", paddingLeft: `${padding}px` }}>
        {series.map((s, i) => (
          <span key={s.keyword} style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginRight: "16px", fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>
            <i style={{ width: "12px", height: "12px", borderRadius: "3px", background: colors[i % colors.length], display: "inline-block" }} />
            {s.keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
