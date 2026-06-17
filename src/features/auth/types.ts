export type { AuthResponse, Role, User } from "../../types/auth.types";

export type AuthMode = "login" | "register";

export type AuthFormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type PasswordRule = {
  label: string;
  valid: boolean;
};
