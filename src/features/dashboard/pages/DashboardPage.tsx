import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Database, Download, Sparkles, LineChart, FolderHeart, Activity } from "lucide-react";
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
  const [services, setServices] = useState([
    { name: "Catalog Service", desc: "Metadata index for journals & articles", status: "online" },
    { name: "Analytics Engine", desc: "Calculations, topic modeling & gaps", status: "online" },
    { name: "Export Worker", desc: "Asynchronous report file compiler", status: "online" },
    { name: "Workspace Sync", desc: "User bookmarks & charts keeper", status: "online" }
  ]);

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
      
      // Update microservices status check dynamically
      const catalogHealthy = results[0].status === "fulfilled" && results[1].status === "fulfilled";
      const exportHealthy = results[3].status === "fulfilled";
      
      setServices([
        { name: "Catalog Service", desc: "Metadata index for journals & articles", status: catalogHealthy ? "online" : "offline" },
        { name: "Analytics Engine", desc: "Calculations, topic modeling & gaps", status: "online" },
        { name: "Export Worker", desc: "Asynchronous report file compiler", status: exportHealthy ? "online" : "offline" },
        { name: "Workspace Sync", desc: "User bookmarks & charts keeper", status: "online" }
      ]);

      if (results.some((r) => r.status === "rejected")) notify("Some services returned offline. Check docker gateway.", "info");
    });
  }, [notify]);

  return (
    <section className="page-stack">
      {/* Welcome Hero Section */}
      <div className="onboarding-hero">
        <div className="hero-content">
          <h1>Welcome to SciTrend 🌟</h1>
          <p>
            SciTrend is your intelligent visual gateway to scientific literature trends. 
            We index publications, analyze keyword dynamics, identify emerging topic gaps, and compile report downloads to power your academic research.
          </p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => window.location.hash = "#articles"}>
              <BookOpen size={16} /> Start Searching
            </button>
            <button className="icon-text" onClick={() => window.location.hash = "#analytics"}>
              <LineChart size={16} /> Run Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Counter Stats */}
      <div className="metric-grid">
        <MetricCard icon={<BookOpen />} label="Total Articles" value={stats.articles} loading={busy} />
        <MetricCard icon={<Database />} label="Total Journals" value={stats.journals} loading={busy} />
        <MetricCard icon={<Bookmark />} label="Catalog Keywords" value={stats.keywords} loading={busy} />
        <MetricCard icon={<Download />} label="My Export Reports" value={stats.exports} loading={busy} />
      </div>

      {/* Two Column Layout: Visuals & Guides */}
      <div className="two-column wide-left">
        <div className="page-stack">
          {/* Trend Watch Chart */}
          <Panel title="Realtime Trend Preview">
            <AnalyticsPreview />
          </Panel>

          {/* Microservices Health Dashboard */}
          <Panel title="Connected Architecture Status">
            <div className="services-list" style={{ display: "grid", gap: "12px", marginTop: "10px" }}>
              {services.map((svc) => (
                <div 
                  key={svc.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--border-radius-md)",
                    background: "var(--panel)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div 
                      style={{ 
                        display: "grid", 
                        placeItems: "center", 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "var(--border-radius-sm)",
                        background: svc.status === "online" ? "var(--success-light)" : "var(--danger-light)",
                        color: svc.status === "online" ? "var(--success)" : "var(--danger)"
                      }}
                    >
                      <Activity size={16} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "14px", color: "var(--text)" }}>{svc.name}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>{svc.desc}</span>
                    </div>
                  </div>
                  <span 
                    className={`status ${svc.status === "online" ? "completed" : "failed"}`} 
                    style={{ fontSize: "11px", textTransform: "uppercase", padding: "2px 8px" }}
                  >
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Feature Tour Guide panel */}
        <Panel title="Platform Features Tour">
          <div className="tour-list" style={{ display: "grid", gap: "16px", marginTop: "8px" }}>
            <div className="tour-item">
              <div className="tour-icon-wrap"><BookOpen size={18} /></div>
              <div className="tour-body">
                <h4>Literature Browser</h4>
                <p>Browse through indexed research papers and journals. View citations, check DOI links, and inspect author affiliations.</p>
              </div>
            </div>

            <div className="tour-item">
              <div className="tour-icon-wrap"><Sparkles size={18} /></div>
              <div className="tour-body">
                <h4>Analytics Laboratory</h4>
                <p>Run issue Word Clouds, graph publication volume over years, check emerging topics, and mine research gaps dynamically.</p>
              </div>
            </div>

            <div className="tour-item">
              <div className="tour-icon-wrap"><FolderHeart size={18} /></div>
              <div className="tour-body">
                <h4>Personal Workspace</h4>
                <p>Pin article bookmarks, reload saved analytics chart templates, write research notes, and trace connections in real time.</p>
              </div>
            </div>

            <div className="tour-item">
              <div className="tour-icon-wrap"><Download size={18} /></div>
              <div className="tour-body">
                <h4>Asynchronous Exports</h4>
                <p>Configure custom queries, request Excel or CSV data reports, monitor builder tasks, and download compiled files securely.</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function getTotal<T>(result: PromiseSettledResult<Paged<T>>) {
  return result.status === "fulfilled" ? result.value.pagination?.totalItems ?? getPagedItems(result.value).length : 0;
}
