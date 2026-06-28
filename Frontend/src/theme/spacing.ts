/** Escala de espaciado (múltiplos de 4) — usar SIEMPRE estos valores. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Radios de borde — suaves pero estilizados (look limpio y moderno). */
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
