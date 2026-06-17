import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "./ToastProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
