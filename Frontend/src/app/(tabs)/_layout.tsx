import { Redirect, Stack } from "expo-router";

import { LoadingScreen } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";

/** Guard de la app. El carrusel se monta dentro de la pantalla índice. */
export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
