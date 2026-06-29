import type { WordCloudItem } from "../../types/analytics.types";
import { EmptyState } from "../components/EmptyState";

export function WordCloudSvg({ data }: { data: WordCloudItem[] }) {
  if (!data.length) return <EmptyState title="No keyword data available" />;
  return (
    <div className="word-capsule-list">
      {data.map((item) => (
        <span
          key={item.word}
          className="word-capsule"
          style={{
            transform: `scale(${0.9 + item.weight * 0.3})`,
            margin: "4px"
          }}
          title={`Weight: ${item.weight.toFixed(2)}`}
        >
          {item.word}
          <small>{item.count}</small>
        </span>
      ))}
    </div>
  );
}
