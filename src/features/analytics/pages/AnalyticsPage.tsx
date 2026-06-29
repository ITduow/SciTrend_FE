import { useEffect, useState } from "react";
import { BarChart3, Bookmark, Search } from "lucide-react";
import { httpClient as api, getPagedItems } from "../../../api/httpClient";
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

  // Entity Autocomplete State
  const [entityType, setEntityType] = useState("journals");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const run = async (overrideParams?: any) => {
    setLoading(true);
    try {
      let result: unknown;
      const activeTab = overrideParams?.tab ?? tab;
      const activeKeywords = overrideParams?.keywords ?? keywords;
      const activeKeyword = overrideParams?.keyword ?? keyword;
      const activeEntityId = overrideParams?.entityId ?? entityId;
      const activeStartYear = overrideParams?.startYear ?? startYear;
      const activeEndYear = overrideParams?.endYear ?? endYear;

      if (!activeEntityId && ["word-cloud", "top-topics", "publication-volume", "emerging-topics", "research-gaps"].includes(activeTab)) {
        notify("Please search and select an entity first.", "info");
        setLoading(false);
        return;
      }

      if (activeTab === "trends") result = await api.get<TrendSeries[]>("/api/v1/analytics/trends", { keywords: activeKeywords, startYear: activeStartYear, endYear: activeEndYear });
      if (activeTab === "word-cloud") result = await api.get<WordCloudItem[]>(`/api/v1/analytics/word-cloud/${activeEntityId}`);
      if (activeTab === "growth-rate") result = await api.get("/api/v1/analytics/growth-rate", { keyword: activeKeyword });
      if (activeTab === "top-topics") result = await api.get(`/api/v1/analytics/top-topics/${activeEntityId}`, { topN: 20 });
      if (activeTab === "publication-volume") result = await api.get(`/api/v1/analytics/publication-volume/${activeEntityId}`, { startYear: activeStartYear, endYear: activeEndYear });
      if (activeTab === "emerging-topics") result = await api.get(`/api/v1/analytics/emerging-topics/${activeEntityId}`, { fromYear: activeStartYear, toYear: activeEndYear, topN: 20 });
      if (activeTab === "saturated-topics") result = await api.get("/api/v1/analytics/saturated-topics", { topN: 20 });
      if (activeTab === "research-gaps") result = await api.get(`/api/v1/analytics/research-gaps/${activeEntityId}`, { topN: 20 });
      if (activeTab === "journal-recommendations") result = await api.get("/api/v1/analytics/journal-recommendations", { keyword: activeKeyword, topN: 10 });
      setData(result);
    } catch (error) {
      notify(errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  // Workspace Load Hook
  useEffect(() => {
    const storedConfig = sessionStorage.getItem("load_chart_config");
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        setTab(config.tab || "trends");
        if (config.keywords !== undefined) setKeywords(config.keywords);
        if (config.keyword !== undefined) setKeyword(config.keyword);
        if (config.entityId !== undefined) {
          setEntityId(config.entityId);
          setSelectedEntityName(`Loaded entity ID: ${config.entityId.slice(0, 8)}`);
        }
        if (config.startYear !== undefined) setStartYear(Number(config.startYear));
        if (config.endYear !== undefined) setEndYear(Number(config.endYear));
        
        sessionStorage.removeItem("load_chart_config");
        
        // Execute immediately
        run(config);
      } catch (err) {
        // Safe check
      }
    }
  }, []);

  // Autocomplete search
  const performSearch = async (queryText: string, type: string) => {
    setSearching(true);
    try {
      const res = await api.get<any>(`/api/v1/${type}`, { search: queryText, page: 1, size: 25 });
      setSearchResults(getPagedItems(res));
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      const timer = setTimeout(() => {
        performSearch(searchQuery, entityType);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, entityType, showDropdown]);

  const selectEntity = (item: any) => {
    const name = item.title || item.name || item.word || `ID: ${item.id.slice(0, 8)}`;
    setEntityId(item.id);
    setSelectedEntityName(name);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const changeEntityType = (type: string) => {
    setEntityType(type);
    setEntityId("");
    setSelectedEntityName("");
    setSearchQuery("");
    setSearchResults([]);
  };

  const saveChart = async () => {
    try {
      const name = prompt("Enter a name for your saved chart:", `${tab} - ${new Date().toLocaleDateString()}`);
      if (!name) return;
      await api.post("/api/v1/workspace/saved-charts", {
        name,
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
        <div className="filter-row align-end">
          {["trends"].includes(tab) && <label>Keywords (comma separated)<input value={keywords} onChange={(e) => setKeywords(e.target.value)} /></label>}
          {["growth-rate", "journal-recommendations"].includes(tab) && <label>Keyword<input value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>}
          
          {["word-cloud", "top-topics", "publication-volume", "emerging-topics", "research-gaps"].includes(tab) && (
            <div className="autocomplete-container" style={{ flex: "1 1 300px" }}>
              <label>Select Entity Type & Search</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <select value={entityType} onChange={(e) => changeEntityType(e.target.value)} style={{ flex: "0 0 130px", minHeight: "40px" }}>
                  <option value="journals">Journals</option>
                  <option value="publishers">Publishers</option>
                  <option value="subject-areas">Subject Areas</option>
                  <option value="issues">Issues</option>
                </select>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={selectedEntityName ? `Selected: ${selectedEntityName}` : "Type to search..."}
                    style={{ paddingRight: "30px" }}
                  />
                  <Search size={16} style={{ position: "absolute", right: "10px", top: "12px", color: "var(--muted)" }} />
                  
                  {showDropdown && (
                    <div className="autocomplete-list">
                      {searching && <div className="autocomplete-loading">Searching...</div>}
                      {!searching && searchResults.length === 0 && (
                        <div className="autocomplete-loading">No results found. Type something else.</div>
                      )}
                      {!searching && searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="autocomplete-item"
                          onClick={() => selectEntity(item)}
                          type="button"
                        >
                          {item.title || item.name || item.word || `ID: ${item.id.slice(0, 8)}`}
                          {item.issn && <small style={{ float: "right", color: "var(--muted)" }}>ISSN: {item.issn}</small>}
                          {item.code && <small style={{ float: "right", color: "var(--muted)" }}>Code: {item.code}</small>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {selectedEntityName && (
                <div style={{ fontSize: "12px", marginTop: "4px", color: "var(--success-dark)", fontWeight: 600 }}>
                  Active Entity: {selectedEntityName} (id: {entityId.slice(0, 8)}...)
                  <button
                    onClick={() => { setEntityId(""); setSelectedEntityName(""); }}
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", marginLeft: "8px", fontWeight: "bold" }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {["trends", "publication-volume", "emerging-topics"].includes(tab) && <label>Start Year<input type="number" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} /></label>}
          {["trends", "publication-volume", "emerging-topics"].includes(tab) && <label>End Year<input type="number" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} /></label>}
          <button className="primary-button compact" onClick={() => run()} disabled={loading} style={{ minHeight: "40px" }}><BarChart3 size={16} />Run Analysis</button>
        </div>
      </Panel>
      
      {/* Hide dropdown click listener */}
      {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />}

      <div style={{ position: "relative", zIndex: 10 }}>
        <Panel title="Results">
          {loading && <EmptyState title="Loading analytics" />}
          {!loading && !data && <EmptyState title="Choose parameters and run an analysis." />}
          {!loading && data !== null && <AnalyticsResult tab={tab} data={data} />}
        </Panel>
      </div>
    </section>
  );
}
