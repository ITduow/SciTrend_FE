import type { Column } from "../components/DataTable";
import type { NamedEntity } from "../../types/common.types";
import { titleCase } from "./format";

export function compactColumns(keys: string[]): Array<Column<Record<string, unknown>>> {
  return keys.map((key) => ({ key, label: titleCase(key) }));
}

export function deriveColumns(rows: NamedEntity[]): Array<Column<Record<string, unknown>>> {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
    .filter((key) => !["id"].includes(key))
    .slice(0, 7);
  return compactColumns(keys.length ? keys : ["id"]);
}

export function toTableRows<T>(rows: T[]): Record<string, unknown>[] {
  return rows as Record<string, unknown>[];
}
