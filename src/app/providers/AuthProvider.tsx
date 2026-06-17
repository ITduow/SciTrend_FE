import { createContext, useMemo, useState, type ReactNode } from "react";
import { getStoredAuth, setStoredAuth, type StoredAuth } from "../../api/tokenStorage";

type AuthContextValue = {
  auth: StoredAuth | null;
  setAuth: (auth: StoredAuth | null) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, updateAuth] = useState<StoredAuth | null>(getStoredAuth());
  const value = useMemo(
    () => ({
      auth,
      setAuth: (next: StoredAuth | null) => {
        setStoredAuth(next);
        updateAuth(next);
      }
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
