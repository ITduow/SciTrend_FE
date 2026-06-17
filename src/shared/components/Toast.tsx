import type { ToastMessage } from "../../app/providers/ToastProvider";

export function Toast({ toast }: { toast: ToastMessage }) {
  return <div className={`toast ${toast.type}`}>{toast.message}</div>;
}
