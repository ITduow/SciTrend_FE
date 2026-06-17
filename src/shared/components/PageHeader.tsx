import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div>{actions}</div>
    </div>
  );
}
