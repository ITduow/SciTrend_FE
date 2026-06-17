import { AUTH_STORAGE_KEY } from "../config/constants";
import type { AuthResponse } from "../types/auth.types";

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: AuthResponse["user"];
};

export const getStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (auth: StoredAuth | null) => {
  if (!auth) localStorage.removeItem(AUTH_STORAGE_KEY);
  else localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};
