import {
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";

/**
 * Carga las fuentes del design system:
 * - Fraunces (serif elegante) para títulos y montos destacados.
 * - Plus Jakarta Sans (sans moderna y limpia) para la interfaz.
 */
export function useAppFonts() {
  const [loaded, error] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return { fontsLoaded: loaded, fontError: error };
}
