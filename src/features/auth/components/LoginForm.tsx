import { useState, type FormEvent } from "react";
import { authApi } from "../api/authApi";
import type { AuthResponse } from "../../../types/auth.types";

export function LoginForm({ onSuccess, onError }: { onSuccess: (auth: AuthResponse) => void; onError?: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      onSuccess(await authApi.login(email, password));
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Login failed.");
    }
  };
  return (
    <form className="form-stack" onSubmit={submit}>
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="primary-button">Login</button>
    </form>
  );
}
