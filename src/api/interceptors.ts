import { endpoints } from "./endpoints";
import { getStoredAuth, setStoredAuth, type StoredAuth } from "./tokenStorage";
import type { AuthResponse } from "../types/auth.types";

export function withAuthHeaders(headers: Headers) {
  const auth = getStoredAuth();
  if (auth?.accessToken) headers.set("Authorization", `Bearer ${auth.accessToken}`);
  return headers;
}

export async function refreshAccessToken(apiBaseUrl: string, refreshToken: string): Promise<StoredAuth> {
  const res = await fetch(`${apiBaseUrl}${endpoints.auth.refresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) throw new Error("Session expired. Please login again.");
  const payload = await res.json();
  const next = (payload.data ?? payload) as AuthResponse;
  setStoredAuth(next);
  return next;
}
