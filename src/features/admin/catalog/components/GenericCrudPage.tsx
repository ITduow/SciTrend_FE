import { ResourceSelector } from "./ResourceSelector";
import { ResourceTable } from "./ResourceTable";

export function GenericCrudPage({ resource, rows, onResource }: { resource: string; rows: Record<string, unknown>[]; onResource: (resource: string) => void }) {
  return <section className="page-stack"><ResourceSelector value={resource} onChange={onResource} /><ResourceTable rows={rows} /></section>;
}
