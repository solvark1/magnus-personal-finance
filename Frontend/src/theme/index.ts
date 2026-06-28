/**
 * Punto único de acceso al tema. Importar SIEMPRE desde aquí:
 *   import { theme } from '@/theme';
 */
import { colors, palette } from "./colors";
import { shadows } from "./shadows";
import { radius, spacing } from "./spacing";
import { fontFamily, fontSize, textVariants } from "./typography";

export const theme = {
  colors,
  palette,
  spacing,
  radius,
  shadows,
  fontFamily,
  fontSize,
  textVariants,
} as const;

export type Theme = typeof theme;

export { colors, palette } from "./colors";
export type { ColorToken } from "./colors";
export { shadows } from "./shadows";
export { radius, spacing } from "./spacing";
export type { Radius, Spacing } from "./spacing";
export { fontFamily, fontSize, textVariants } from "./typography";
export type { TextVariant } from "./typography";

