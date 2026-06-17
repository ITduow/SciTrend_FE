import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const { setAuth } = useAuth();
  return <RegisterForm onSuccess={setAuth} />;
}
