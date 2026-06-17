import { Bell } from "lucide-react";

export function EmptyState({ title }: { title: string }) {
  return (
    <div className="empty-state">
      <Bell size={18} />
      <span>{title}</span>
    </div>
  );
}
