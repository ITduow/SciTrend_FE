import { Shield } from "lucide-react";
import type { FormEvent } from "react";
import type { AuthFormState, AuthMode, PasswordRule } from "../types";

export function AuthAccessPanel({
  mode,
  form,
  apiBase,
  authError,
  loading,
  gatewayStatus,
  passwordRules,
  onModeChange,
  onFormChange,
  onApiBaseChange,
  onCheckGateway,
  onFillDemo,
  onSubmit,
  onBackHome
}: {
  mode: AuthMode;
  form: AuthFormState;
  apiBase: string;
  authError: string;
  loading: boolean;
  gatewayStatus: "idle" | "checking" | "online" | "offline";
  passwordRules: PasswordRule[];
  onModeChange: (mode: AuthMode) => void;
  onFormChange: (form: AuthFormState) => void;
  onApiBaseChange: (value: string) => void;
  onCheckGateway: () => void;
  onFillDemo: (email: string, password: string) => void;
  onSubmit: (event: FormEvent) => void;
  onBackHome?: () => void;
}) {
  const demoAccounts = [
    { label: "Admin", email: "admin@scitrend.io", password: "Admin@123456", role: "SystemAdmin" },
    { label: "Researcher", email: "testuser01@example.com", password: "Test@123456", role: "EndUser" }
  ];

  return (
    <section className="auth-panel">
      <div className="auth-panel-header">
        <div>
          <span>{mode === "login" ? "Welcome back" : "Create access"}</span>
          <h2>{mode === "login" ? "Login to SciTrend" : "Register researcher account"}</h2>
        </div>
        <div className="auth-panel-tools">
          {onBackHome && <button className="icon-text" onClick={onBackHome}>Home</button>}
          <Shield size={24} />
        </div>
      </div>
      <div className="segmented">
        <button className={mode === "login" ? "selected" : ""} onClick={() => onModeChange("login")}>Login</button>
        <button className={mode === "register" ? "selected" : ""} onClick={() => onModeChange("register")}>Register</button>
      </div>
      {authError && <div className="form-alert">{authError}</div>}

      {mode === "login" && (
        <div className="demo-account-grid">
          {demoAccounts.map((account) => (
            <button key={account.email} onClick={() => onFillDemo(account.email, account.password)}>
              <strong>{account.label}</strong>
              <span>{account.role}</span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="form-stack">
        {mode === "register" && (
          <label>
            Username
            <input value={form.username} onChange={(e) => onFormChange({ ...form, username: e.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => onFormChange({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => onFormChange({ ...form, password: e.target.value })} required />
        </label>
        {mode === "register" && (
          <label>
            Confirm password
            <input type="password" value={form.confirmPassword} onChange={(e) => onFormChange({ ...form, confirmPassword: e.target.value })} required />
          </label>
        )}
        <label>
          API Gateway
          <input value={apiBase} onChange={(e) => onApiBaseChange(e.target.value)} />
        </label>
        <div className="gateway-row">
          <button type="button" className="icon-text" onClick={onCheckGateway} disabled={gatewayStatus === "checking"}>
            {gatewayStatus === "checking" ? "Checking..." : "Check Gateway"}
          </button>
          <span className={`gateway-state ${gatewayStatus}`}>{gatewayStatus}</span>
        </div>
        {mode === "register" && (
          <div className="password-rules">
            {passwordRules.map((rule) => (
              <span key={rule.label} className={rule.valid ? "valid" : ""}>{rule.label}</span>
            ))}
          </div>
        )}
        <button className="primary-button" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
      {mode === "login" && (
        <p className="auth-hint">
          Use a seeded account or create a new user in Register. Admin features require the SystemAdmin role.
        </p>
      )}
    </section>
  );
}
