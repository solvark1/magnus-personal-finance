import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Almacenamiento seguro multiplataforma.
 * - Nativo (Android/iOS): expo-secure-store (cifrado).
 * - Web: localStorage (SecureStore no existe en web).
 */
const isWeb = Platform.OS === "web";

export const storage = {
  async get(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (isWeb) {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    if (isWeb) {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const STORAGE_KEYS = {
  token: "magnus.auth.token",
  refreshToken: "magnus.auth.refresh",
} as const;
