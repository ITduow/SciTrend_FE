import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Database, Download } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { Paged } from "../../../types/api.types";
import type { Article } from "../../../types/catalog.types";
import type { NamedEntity } from "../../../types/common.types";
import type { ExportJob } from "../../exports/api/exportsApi";
import { Panel } from "../../../shared/components/Panel";
import { MetricCard } from "../../../shared/charts/MetricCard";
import { AnalyticsPreview } from "../../../shared/charts/AnalyticsPreview";

export function DashboardPage({ notify }: { notify: Notify }) {
  const [stats, setStats] = useState({ articles: 0, journals: 0, keywords: 0, exports: 0 });
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get<Paged<Article>>("/api/v1/articles", { page: 1, size: 1 }),
      api.get<Paged<NamedEntity>>("/api/v1/journals", { page: 1, size: 1 }),
      api.get<Paged<NamedEntity>>("/api/v1/keywords", { page: 1, size: 1 }),
      api.get<ExportJob[]>("/api/v1/exports")
    ]).then((results) => {
      setStats({
        articles: getTotal(results[0]),
        journals: getTotal(results[1]),
        keywords: getTotal(results[2]),
        exports: results[3].status === "fulfilled" ? results[3].value.length : 0
      });
      setBusy(false);
      if (results.some((r) => r.status === "rejected")) notify("Some dashboard widgets could not load.", "info");
    });
  }, [notify]);

  return (
    <section className="page-stack">
      <div className="metric-grid">
        <MetricCard icon={<BookOpen />} label="Articles" value={stats.articles} loading={busy} />
        <MetricCard icon={<Database />} label="Journals" value={stats.journals} loading={busy} />
        <MetricCard icon={<Bookmark />} label="Keywords" value={stats.keywords} loading={busy} />
        <MetricCard icon={<Download />} label="Exports" value={stats.exports} loading={busy} />
      </div>
      <div className="two-column">
        <Panel title="Trend Watch">
          <AnalyticsPreview />
        </Panel>
        <Panel title="Operational Focus">
          <div className="timeline">
            <div><strong>1</strong><span>Search publications and inspect article metadata.</span></div>
            <div><strong>2</strong><span>Compare keyword growth across publication years.</span></div>
            <div><strong>3</strong><span>Save charts, export reports, and monitor background jobs.</span></div>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function getTotal<T>(result: PromiseSettledResult<Paged<T>>) {
  return result.status === "fulfilled" ? result.value.pagination?.totalItems ?? getPagedItems(result.value).length : 0;
}
