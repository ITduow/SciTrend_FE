import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { setAuth } = useAuth();
  return <LoginForm onSuccess={setAuth} />;
}
