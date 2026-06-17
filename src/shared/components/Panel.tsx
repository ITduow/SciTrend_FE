import type { ReactNode } from "react";

export function Panel({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        <div>{actions}</div>
      </div>
      {children}
    </section>
  );
}
