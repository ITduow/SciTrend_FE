import type { ReactNode } from "react";
import { routes, type RouteKey } from "./routes";

export function resolveRoute(key: RouteKey) {
  return routes.find((route) => route.key === key) ?? routes[0];
}

export function RouterSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
