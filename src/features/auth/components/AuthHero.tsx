import { Activity, BarChart3, BookOpen, Bookmark, Download } from "lucide-react";
import type { AuthMode } from "../types";

export function AuthHero({ onModeChange }: { onModeChange: (mode: AuthMode) => void }) {
  return (
    <section className="auth-home">
      <div className="auth-hero">
        <div className="home-nav">
          <div className="brand large">
            <div className="brand-mark"><Activity size={28} /></div>
            <div>
              <strong>SciTrend</strong>
              <span>Scientific Journal Publication Trend Tracking System</span>
            </div>
          </div>
          <div className="home-nav-actions">
            <button className="icon-text" onClick={() => onModeChange("login")}>Login</button>
            <button className="primary-button" onClick={() => onModeChange("register")}>Register</button>
          </div>
        </div>

        <div className="hero-copy">
          <span className="eyebrow">Publication Intelligence Platform</span>
          <h1>Track journal publication trends before the research landscape shifts.</h1>
          <p>
            Explore articles, journals, keywords, growth signals, research gaps, and exportable
            reports from one focused scientific trend workspace.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onModeChange("login")}>Access workspace</button>
            <button className="icon-text" onClick={() => onModeChange("register")}>Create researcher account</button>
          </div>
        </div>

        <div className="home-feature-grid">
          {[
            ["Trend analytics", "Compare keyword velocity across publication years."],
            ["Research gaps", "Find high-growth topics with low publication density."],
            ["Journal fit", "Rank journals by topic relevance and article volume."],
            ["Workspace", "Bookmark articles, save charts, and export reports."]
          ].map(([title, body]) => (
            <div className="home-feature" key={title}>
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-insights">
        <div className="insight-card primary">
          <div>
            <span>Emerging signal</span>
            <strong>Graph Neural Networks</strong>
          </div>
          <div className="mini-bars">
            {[34, 48, 61, 77, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
        </div>
        <div className="signal-grid">
          {[
            ["Publication volume", "82"],
            ["Emerging topics", "47"],
            ["Research gaps", "64"],
            ["Journal matches", "29"]
          ].map(([label, value]) => (
            <div className="signal-cell" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="workflow-strip">
          <span><BookOpen size={16} />Ingest</span>
          <span><BarChart3 size={16} />Analyze</span>
          <span><Bookmark size={16} />Save</span>
          <span><Download size={16} />Export</span>
        </div>
      </div>
    </section>
  );
}
