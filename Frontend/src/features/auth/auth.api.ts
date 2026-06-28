import { api } from "@/api/client";
import { User } from "@/types/models";

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: User;
}

/**
 * API de autenticación. En el MVP real, `loginWithGoogle` recibe el
 * authorization_code de Google; en el mock se ignora y devuelve un usuario fijo.
 */
export const authApi = {
  loginWithGoogle: (authorizationCode?: string) =>
    api.post<LoginResponse>("/auth/google", {
      code: authorizationCode ?? "mock-code",
    }),

  me: () => api.get<User>("/auth/me"),

  logout: () => api.del("/auth/logout"),
};
