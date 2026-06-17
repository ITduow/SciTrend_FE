import { useState, type FormEvent } from "react";
import { httpClient as api, getApiBaseUrl, setApiBaseUrl } from "../../../api/httpClient";
import type { AuthResponse } from "../../../types/auth.types";
import type { Notify } from "../../../app/app.types";
import type { ToastMessage } from "../../../app/providers/ToastProvider";
import { authErrorMessage } from "../../../shared/utils/errors";
import { AuthHero } from "../components/AuthHero";
import { AuthAccessPanel } from "../components/AuthAccessPanel";
import type { AuthFormState, AuthMode } from "../types";

export function AuthHomePage({
  onAuth,
  notify,
  toast
}: {
  onAuth: (auth: AuthResponse) => void;
  notify: Notify;
  toast: ToastMessage | null;
}) {
  const [view, setView] = useState<"home" | "auth">("home");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [apiBase, setApiBase] = useState(getApiBaseUrl());
  const [form, setForm] = useState<AuthFormState>({ username: "", email: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [gatewayStatus, setGatewayStatus] = useState<"idle" | "checking" | "online" | "offline">("idle");

  const passwordRules = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "Uppercase and lowercase", valid: /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) },
    { label: "At least one number", valid: /\d/.test(form.password) },
    { label: "At least one special character", valid: /[^a-zA-Z\d]/.test(form.password) },
    { label: "Confirmation matches", valid: mode === "login" || form.password === form.confirmPassword }
  ];

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setAuthError("");
    setView("auth");
  };

  const fillDemo = (email: string, password: string) => {
    setMode("login");
    setAuthError("");
    setForm((current) => ({ ...current, email, password }));
  };

  const validateAuthForm = () => {
    if (!form.email.trim()) return "Email is required.";
    if (!form.password) return "Password is required.";
    if (mode === "register") {
      if (form.username.trim().length < 3) return "Username must be at least 3 characters.";
      if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return "Username may only contain letters, digits, and underscores.";
      const failedRule = passwordRules.find((rule) => !rule.valid);
      if (failedRule) return `Password requirement missing: ${failedRule.label}.`;
    }
    return "";
  };

  const checkGateway = async () => {
    setGatewayStatus("checking");
    setApiBaseUrl(apiBase);
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/health`);
      setGatewayStatus(response.ok ? "online" : "offline");
    } catch {
      setGatewayStatus("offline");
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError("");
    const validationMessage = validateAuthForm();
    if (validationMessage) {
      setAuthError(validationMessage);
      notify(validationMessage, "error");
      return;
    }
    setLoading(true);
    setApiBaseUrl(apiBase);
    try {
      const data = await api.post<AuthResponse>(
        mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register",
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              username: form.username,
              email: form.email,
              password: form.password,
              confirmPassword: form.confirmPassword || form.password
            }
      );
      onAuth(data);
      notify("Signed in successfully.", "success");
    } catch (error) {
      const message = authErrorMessage(error, mode);
      setAuthError(message);
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${view === "home" ? "home-only" : "auth-only"}`}>
      {view === "home" && <AuthHero onModeChange={switchMode} />}
      {view === "auth" && (
      <AuthAccessPanel
        mode={mode}
        form={form}
        apiBase={apiBase}
        authError={authError}
        loading={loading}
        gatewayStatus={gatewayStatus}
        passwordRules={passwordRules}
        onModeChange={switchMode}
        onFormChange={setForm}
        onApiBaseChange={setApiBase}
        onCheckGateway={checkGateway}
        onFillDemo={fillDemo}
        onSubmit={submit}
        onBackHome={() => {
          setView("home");
          setAuthError("");
        }}
      />
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
