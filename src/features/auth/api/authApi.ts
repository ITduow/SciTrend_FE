import { endpoints } from "../../../api/endpoints";
import { httpClient } from "../../../api/httpClient";
import type { AuthResponse } from "../../../types/auth.types";

export const authApi = {
  login: (email: string, password: string) => httpClient.post<AuthResponse>(endpoints.auth.login, { email, password }),
  register: (payload: { username: string; email: string; password: string; confirmPassword?: string }) =>
    httpClient.post<AuthResponse>(endpoints.auth.register, payload),
  logout: (refreshToken: string) => httpClient.post(endpoints.auth.logout, { refreshToken }),
  me: () => httpClient.get<AuthResponse["user"]>(endpoints.auth.me)
};
