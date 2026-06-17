import { useMemo } from "react";
import type { TrendSeries } from "../../types/analytics.types";
import { LineChartSvg } from "./LineChartSvg";

export function AnalyticsPreview() {
  const sample: TrendSeries[] = useMemo(
    () => [
      {
        keyword: "AI",
        dataPoints: [
          { year: 2021, articleCount: 12 },
          { year: 2022, articleCount: 20 },
          { year: 2023, articleCount: 31 },
          { year: 2024, articleCount: 44 }
        ]
      },
      {
        keyword: "Graph Neural Networks",
        dataPoints: [
          { year: 2021, articleCount: 6 },
          { year: 2022, articleCount: 15 },
          { year: 2023, articleCount: 24 },
          { year: 2024, articleCount: 28 }
        ]
      }
    ],
    []
  );

  return <LineChartSvg series={sample} />;
}
