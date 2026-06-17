export function BarChartSvg({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="bar-list">
      {data.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <div><i style={{ width: `${(item.value / max) * 100}%` }} /></div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
