import { API_BASE_STORAGE_KEY } from "../config/constants";
import { env } from "../config/env";
import type { ApiEnvelope, Paged, QueryParams } from "../types/api.types";
import { refreshAccessToken, withAuthHeaders } from "./interceptors";
import { getStoredAuth } from "./tokenStorage";

export const getApiBaseUrl = () => localStorage.getItem(API_BASE_STORAGE_KEY) || env.apiBaseUrl;
export const setApiBaseUrl = (value: string) => localStorage.setItem(API_BASE_STORAGE_KEY, value.replace(/\/$/, ""));

const buildQuery = (params?: QueryParams) => {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = withAuthHeaders(new Headers(options.headers));
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const auth = getStoredAuth();
  if (res.status === 401 && retry && auth?.refreshToken) {
    await refreshAccessToken(baseUrl, auth.refreshToken);
    return request<T>(path, options, false);
  }

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof payload === "object" && payload && "message" in payload ? String(payload.message) : `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  if (typeof payload === "object" && payload && "success" in payload && "data" in payload) return (payload as ApiEnvelope<T>).data;
  return payload as T;
}

export const httpClient = {
  get: <T>(path: string, params?: QueryParams) => request<T>(`${path}${buildQuery(params)}`),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  downloadUrl: (path: string) => `${getApiBaseUrl()}${path}`
};

export const getPagedItems = <T>(paged: Paged<T> | T[]): T[] => (Array.isArray(paged) ? paged : paged.items ?? []);
