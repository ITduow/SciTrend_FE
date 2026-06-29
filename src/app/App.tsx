import { useEffect, useState } from "react";
import { Activity, LogOut, Menu, UserRound } from "lucide-react";
import { httpClient as api } from "../api/httpClient";
import { getStoredAuth, setStoredAuth } from "../api/tokenStorage";
import type { User } from "../types/auth.types";
import type { ToastMessage, ToastTone } from "./providers/ToastProvider";
import type { RouteKey } from "./routes";
import { navItems } from "./navigation";
import { AuthHomePage } from "../features/auth/pages/AuthHomePage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { ArticlesPage } from "../features/articles/pages/ArticlesPage";
import { JournalsPage } from "../features/journals/pages/JournalsPage";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { WorkspacePage } from "../features/workspace/pages/WorkspacePage";
import { ExportsPage } from "../features/exports/pages/ExportsPage";
import { AdminIngestionPage } from "../features/admin/ingestion/pages/AdminIngestionPage";
import { AdminCatalogPage } from "../features/admin/catalog/pages/AdminCatalogPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

export function App() {
  const [auth, setAuth] = useState(getStoredAuth());
  const [route, setRoute] = useState<RouteKey>(() => {
    const hash = window.location.hash.replace("#", "") as RouteKey;
    return ["dashboard", "articles", "journals", "analytics", "workspace", "exports", "admin-ingestion", "admin-catalog", "settings"].includes(hash) 
      ? hash 
      : "dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.replace("#", "") as RouteKey;
      if (["dashboard", "articles", "journals", "analytics", "workspace", "exports", "admin-ingestion", "admin-catalog", "settings"].includes(hash)) {
        setRoute(hash);
      }
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const notify = (message: string, type: ToastTone = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  const signOut = async () => {
    try {
      if (auth?.refreshToken) await api.post("/api/v1/auth/logout", { refreshToken: auth.refreshToken });
    } catch {
      // A local sign-out should not be blocked by a stale refresh token.
    }
    setStoredAuth(null);
    setAuth(null);
    window.location.hash = "dashboard";
  };

  if (!auth) {
    return (
      <AuthHomePage
        onAuth={(value) => {
          setStoredAuth(value);
          setAuth(value);
        }}
        notify={notify}
        toast={toast}
      />
    );
  }

  const visibleNav = navItems.filter((item) => !item.adminOnly || auth.user.role === "SystemAdmin");
  const currentTitle = visibleNav.find((item) => item.key === route)?.label ?? "SciTrend";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={21} /></div>
          <div>
            <strong>SciTrend</strong>
            <span>Publication Intelligence</span>
          </div>
        </div>
        <nav>
          {visibleNav.map((item) => (
            <button
              key={item.key}
              className={route === item.key ? "active" : ""}
              onClick={() => {
                window.location.hash = item.key;
                setSidebarOpen(false);
              }}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="workspace-frame">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} title="Open navigation">
            <Menu size={19} />
          </button>
          <div>
            <h1>{currentTitle}</h1>
            <p>Track scientific publication trends, topics, journals, and research signals.</p>
          </div>
          <div className="topbar-actions">
            <UserChip user={auth.user} />
            <button className="icon-button" onClick={signOut} title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {sidebarOpen && <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

        <main>
          <RouteContent route={route} user={auth.user} notify={notify} />
        </main>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

function UserChip({ user }: { user: User }) {
  return (
    <div className="user-chip">
      <UserRound size={17} />
      <span>{user.username}</span>
      <strong>{user.role}</strong>
    </div>
  );
}

function RouteContent({
  route,
  user,
  notify
}: {
  route: RouteKey;
  user: User;
  notify: (message: string, type?: ToastTone) => void;
}) {
  switch (route) {
    case "dashboard":
      return <DashboardPage notify={notify} />;
    case "articles":
      return <ArticlesPage notify={notify} />;
    case "journals":
      return <JournalsPage />;
    case "analytics":
      return <AnalyticsPage notify={notify} />;
    case "workspace":
      return <WorkspacePage notify={notify} />;
    case "exports":
      return <ExportsPage notify={notify} />;
    case "admin-ingestion":
      return <AdminIngestionPage notify={notify} />;
    case "admin-catalog":
      return <AdminCatalogPage notify={notify} />;
    case "settings":
      return <SettingsPage auth={user} notify={notify} />;
    default:
      return <DashboardPage notify={notify} />;
  }
}
