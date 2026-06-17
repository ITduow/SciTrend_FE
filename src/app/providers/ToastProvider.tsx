import { createContext, useMemo, useState, type ReactNode } from "react";
import { Toast } from "../../shared/components/Toast";

export type ToastTone = "success" | "error" | "info";
export type ToastMessage = { type: ToastTone; message: string };

type ToastContextValue = {
  toast: ToastMessage | null;
  notify: (message: string, type?: ToastTone) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const value = useMemo(
    () => ({
      toast,
      notify: (message: string, type: ToastTone = "info") => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3200);
      }
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <Toast toast={toast} />}
    </ToastContext.Provider>
  );
}
