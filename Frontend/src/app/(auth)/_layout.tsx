import { Redirect, Stack } from "expo-router";

import { LoadingScreen } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";

/** Guard del flujo de autenticación: si ya hay sesión, va directo a la app. */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
