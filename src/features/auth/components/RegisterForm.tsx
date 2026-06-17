import { useState, type FormEvent } from "react";
import { authApi } from "../api/authApi";
import type { AuthResponse } from "../../../types/auth.types";

export function RegisterForm({ onSuccess, onError }: { onSuccess: (auth: AuthResponse) => void; onError?: (message: string) => void }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      onSuccess(await authApi.register(form));
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Registration failed.");
    }
  };
  return (
    <form className="form-stack" onSubmit={submit}>
      <label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
      <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
      <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
      <label>Confirm password<input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
      <button className="primary-button">Create account</button>
    </form>
  );
}
