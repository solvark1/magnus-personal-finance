/**
 * Tipografía — pareja elegante y seria:
 *   • Fraunces (serif) para títulos y montos destacados → carácter, elegancia.
 *   • Plus Jakarta Sans (sans) para la interfaz → limpia, moderna, legible.
 * Los nombres de familia coinciden con las claves cargadas en useAppFonts().
 */

export const fontFamily = {
  // Serif elegante (Fraunces) — momentos destacados.
  serifMedium: "Fraunces_500Medium",
  serifSemibold: "Fraunces_600SemiBold",
  serifBold: "Fraunces_700Bold",
  // Sans moderna (Plus Jakarta Sans) — UI, cuerpo y controles.
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
  display: 44,
} as const;

/**
 * Variantes de texto reutilizables. El componente <Text> las consume por nombre
 * para garantizar homogeneidad en toda la app.
 */
export const textVariants = {
  // Serif para los grandes momentos (montos, encabezados de pantalla).
  display: {
    fontFamily: fontFamily.serifSemibold,
    fontSize: fontSize.display,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamily.serifSemibold,
    fontSize: fontSize.xxxl,
    lineHeight: 42,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: fontFamily.serifMedium,
    fontSize: fontSize.xxl,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  // Sans para la estructura y la interfaz.
  h3: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, lineHeight: 28 },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.lg, lineHeight: 24 },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
} as const;

export type TextVariant = keyof typeof textVariants;
