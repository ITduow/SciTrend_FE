export function BarChartSvg({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="svg-bar-chart">
      {data.map((item) => (
        <div key={item.label} className="svg-bar-row">
          <span className="svg-bar-label" title={item.label}>{item.label}</span>
          <div className="svg-bar-container">
            <div className="svg-bar-fill" style={{ width: `${(item.value / max) * 100}%` }} title={`${item.label}: ${item.value}`} />
          </div>
          <strong className="svg-bar-value">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
