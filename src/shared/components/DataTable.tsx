import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { formatCell } from "../utils/format";

export type Column<T> = { key: keyof T | string; label: string; render?: (row: T) => ReactNode };

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  loading
}: {
  rows: T[];
  columns: Array<Column<T>>;
  loading?: boolean;
}) {
  if (loading) return <EmptyState title="Loading data" />;
  if (!rows.length) return <EmptyState title="No records found" />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={String(column.key)}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={String(row.id ?? index)}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render ? column.render(row) : formatCell(row[String(column.key)])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
