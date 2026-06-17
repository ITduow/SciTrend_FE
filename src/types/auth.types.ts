export type Role = "SystemAdmin" | "EndUser" | string;

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: User;
};
