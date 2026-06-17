import type { ReactNode } from "react";

export function Topbar({ title, children }: { title: string; children?: ReactNode }) {
  return <header className="topbar"><div><h1>{title}</h1></div>{children}</header>;
}
