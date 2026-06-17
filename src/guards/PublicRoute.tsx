import type { ReactNode } from "react";
import { getStoredAuth } from "../api/tokenStorage";

export function PublicRoute({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return getStoredAuth() ? <>{fallback}</> : <>{children}</>;
}
