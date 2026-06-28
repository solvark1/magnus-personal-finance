import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { queryClient } from "@/api/queryClient";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { User } from "@/types/models";
import { authApi } from "./auth.api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Proveedor de sesión. Mantiene el token persistido y el usuario actual.
 * Toda la lógica de auth vive aquí; las pantallas solo usan `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura la sesión al arrancar la app si hay token guardado.
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.get(STORAGE_KEYS.token);
        if (token) {
          const me = await authApi.me();
          setUser(me);
        }
      } catch {
        await storage.remove(STORAGE_KEYS.token);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function signIn() {
    const res = await authApi.loginWithGoogle();
    await storage.set(STORAGE_KEYS.token, res.token);
    await storage.set(STORAGE_KEYS.refreshToken, res.refresh_token);
    setUser(res.user);
  }

  async function signOut() {
    try {
      await authApi.logout();
    } catch {
      // Ignoramos errores de red al cerrar sesión.
    }
    await storage.remove(STORAGE_KEYS.token);
    await storage.remove(STORAGE_KEYS.refreshToken);
    queryClient.clear();
    setUser(null);
  }

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
