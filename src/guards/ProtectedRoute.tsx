import type { ReactNode } from "react";
import { getStoredAuth } from "../api/tokenStorage";

export function ProtectedRoute({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return getStoredAuth() ? <>{children}</> : <>{fallback}</>;
}
