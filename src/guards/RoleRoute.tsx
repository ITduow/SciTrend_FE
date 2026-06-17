import type { ReactNode } from "react";
import type { Role } from "../types/auth.types";
import { getStoredAuth } from "../api/tokenStorage";

export function RoleRoute({ roles, children, fallback = null }: { roles: Role[]; children: ReactNode; fallback?: ReactNode }) {
  const auth = getStoredAuth();
  return auth && roles.includes(auth.user.role) ? <>{children}</> : <>{fallback}</>;
}
