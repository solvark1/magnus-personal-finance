import { Platform, ViewStyle } from "react-native";

/**
 * Sombras consistentes en iOS/Android/Web.
 * `soft` para tarjetas; `lifted` para elementos flotantes.
 */
function build(
  elevation: number,
  opacity: number,
  radius: number,
  offsetY: number,
): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation },
    default: {
      shadowColor: "#1E1F3F",
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
  })!;
}

export const shadows = {
  none: {} as ViewStyle,
  // Sombras minimalistas: muy sutiles, casi planas. Dan aire sin "peso".
  soft: build(1, 0.04, 10, 2),
  card: build(2, 0.06, 18, 6),
  lifted: build(6, 0.1, 30, 14),
} as const;

export type Shadow = keyof typeof shadows;
