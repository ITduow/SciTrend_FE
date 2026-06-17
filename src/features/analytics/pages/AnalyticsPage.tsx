import { useState } from "react";
import { BarChart3, Bookmark } from "lucide-react";
import { httpClient as api } from "../../../api/httpClient";
import type { Notify } from "../../../app/app.types";
import type { TrendSeries, WordCloudItem } from "../../../types/analytics.types";
import { Panel } from "../../../shared/components/Panel";
import { EmptyState } from "../../../shared/components/EmptyState";
import { AnalyticsResult } from "../../../shared/charts/AnalyticsResult";
import { errorMessage } from "../../../shared/utils/errors";

export function AnalyticsPage({ notify }: { notify: Notify }) {
  const [tab, setTab] = useState("trends");
  const [keywords, setKeywords] = useState("artificial intelligence,machine learning");
  const [keyword, setKeyword] = useState("machine learning");
  const [entityId, setEntityId] = useState("");
  const [startYear, setStartYear] = useState(2018);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      let result: unknown;
      if (tab === "trends") result = await api.get<TrendSeries[]>("/api/v1/analytics/trends", { keywords, startYear, endYear });
      if (tab === "word-cloud") result = await api.get<WordCloudItem[]>(`/api/v1/analytics/word-cloud/${entityId}`);
      if (tab === "growth-rate") result = await api.get("/api/v1/analytics/growth-rate", { keyword });
      if (tab === "top-topics") result = await api.get(`/api/v1/analytics/top-topics/${entityId}`, { topN: 20 });
      if (tab === "publication-volume") result = await api.get(`/api/v1/analytics/publication-volume/${entityId}`, { startYear, endYear });
      if (tab === "emerging-topics") result = await api.get(`/api/v1/analytics/emerging-topics/${entityId}`, { fromYear: startYear, toYear: endYear, topN: 20 });
      if (tab === "saturated-topics") result = await api.get("/api/v1/analytics/saturated-topics", { topN: 20 });
      if (tab === "research-gaps") result = await api.get(`/api/v1/analytics/research-gaps/${entityId}`, { topN: 20 });
      if (tab === "journal-recommendations") result = await api.get("/api/v1/analytics/journal-recommendations", { keyword, topN: 10 });
      setData(result);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const saveChart = async () => {
    try {
      await api.post("/api/v1/workspace/saved-charts", {
        name: `${tab} - ${new Date().toLocaleDateString()}`,
        queryConfig: { tab, keywords, keyword, entityId, startYear, endYear }
      });
      notify("Chart saved to workspace.", "success");
    } catch (error) {
      notify(errorMessage(error), "error");
    }
  };

  return (
    <section className="page-stack">
      <Panel title="Analytics Lab" actions={<button className="icon-text" onClick={saveChart}><Bookmark size={16} />Save chart</button>}>
        <div className="tab-row">
          {[
            ["trends", "Trends"],
            ["word-cloud", "Word Cloud"],
            ["growth-rate", "Growth"],
            ["top-topics", "Top Topics"],
            ["publication-volume", "Volume"],
            ["emerging-topics", "Emerging"],
            ["saturated-topics", "Saturated"],
            ["research-gaps", "Gaps"],
            ["journal-recommendations", "Recommendations"]
          ].map(([key, label]) => <button key={key} className={tab === key ? "selected" : ""} onClick={() => { setTab(key); setData(null); }}>{label}</button>)}
        </div>
        <div className="filter-row">
          {["trends"].includes(tab) && <label>Keywords<input value={keywords} onChange={(e) => setKeywords(e.target.value)} /></label>}
          {["growth-rate", "journal-recommendations"].includes(tab) && <label>Keyword<input value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>}
          {["word-cloud", "top-topics", "publication-volume", "emerging-topics", "research-gaps"].includes(tab) && <label>Entity ID<input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="issue, journal, or subject area uuid" /></label>}
          {["trends", "publication-volume", "emerging-topics"].includes(tab) && <label>Start<input type="number" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} /></label>}
          {["trends", "publication-volume", "emerging-topics"].includes(tab) && <label>End<input type="number" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} /></label>}
          <button className="primary-button compact" onClick={run} disabled={loading}><BarChart3 size={16} />Run</button>
        </div>
      </Panel>
      <Panel title="Results">
        {loading && <EmptyState title="Loading analytics" />}
        {!loading && !data && <EmptyState title="Choose parameters and run an analysis." />}
        {!loading && data !== null && <AnalyticsResult tab={tab} data={data} />}
      </Panel>
    </section>
  );
}
