import { WordCloudSvg } from "../../../shared/charts/WordCloudSvg";
import type { WordCloudItem } from "../../../types/analytics.types";

export function WordCloudPanel({ data }: { data: WordCloudItem[] }) {
  return <WordCloudSvg data={data} />;
}
