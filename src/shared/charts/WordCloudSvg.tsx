import type { WordCloudItem } from "../../types/analytics.types";
import { EmptyState } from "../components/EmptyState";

export function WordCloudSvg({ data }: { data: WordCloudItem[] }) {
  if (!data.length) return <EmptyState title="No keyword data available" />;
  return (
    <div className="word-cloud">
      {data.map((item) => (
        <span key={item.word} style={{ fontSize: `${14 + item.weight * 24}px` }}>
          {item.word}<small>{item.count}</small>
        </span>
      ))}
    </div>
  );
}
