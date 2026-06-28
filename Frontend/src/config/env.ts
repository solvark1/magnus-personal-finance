import { Platform } from "react-native";

/**
 * Configuración central del entorno.
 * La URL del API viene de EXPO_PUBLIC_API_URL (.env) con un fallback sensato
 * según la plataforma para desarrollo local contra el mock server.
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  // Fallbacks de desarrollo si no hay .env.
  // El emulador de Android no alcanza "localhost" del host: usa 10.0.2.2.
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:4000/api/v1`;
}

export const env = {
  apiUrl: resolveApiUrl(),
  isDev: __DEV__,
} as const;
