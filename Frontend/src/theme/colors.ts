/**
 * Paleta base de Magnus (definida por el usuario) + tokens semánticos.
 * Mantener TODO el color aquí: ningún componente debe usar hex sueltos.
 */

// Paleta cruda — los 5 colores de marca.
export const palette = {
  deepBlue: "#1E1F3F", // Azul Profundo
  purple: "#6E72E4", // Púrpura Suave
  gold: "#FFC857", // Dorado
  coral: "#FF8C66", // Coral Suave
  lightGray: "#F2F4F7", // Gris Claro

  // Derivados utilitarios (tintes/sombras de la marca para estados y profundidad).
  purpleDark: "#5257C9", // sombra del púrpura (efecto "3D" tipo Duolingo)
  purpleSoft: "#E7E8FB", // fondo suave púrpura
  goldDark: "#E0A93C",
  coralDark: "#E5734B",
  white: "#FFFFFF",
  black: "#000000",

  // Escala de grises neutra (basada en el gris claro de marca).
  gray100: "#F2F4F7",
  gray200: "#E4E7EC",
  gray300: "#D0D5DD",
  gray400: "#98A2B3",
  gray500: "#667085",
  gray600: "#475467",

  // Semáforo financiero (gastos/ingresos/alertas) — afinado a la marca.
  success: "#3FB984",
  successSoft: "#E3F6EE",
  danger: "#F0506E",
  dangerSoft: "#FDE7EC",
  warning: "#FFC857",
} as const;

/**
 * Tokens semánticos: los componentes consumen ESTOS, no la paleta cruda.
 * Si algún día hacemos modo oscuro, solo cambia este mapa.
 */
export const colors = {
  // Marca
  primary: palette.purple,
  primaryDark: palette.purpleDark,
  primarySoft: palette.purpleSoft,
  // Azul profundo = identidad principal (logo, hero, acentos premium).
  brand: palette.deepBlue,
  brandSoft: "#2A2C52",
  accent: palette.gold,
  accentDark: palette.goldDark,
  highlight: palette.coral,
  highlightDark: palette.coralDark,

  // Superficies
  background: palette.lightGray,
  surface: palette.white,
  surfaceAlt: palette.gray100,

  // Texto
  textPrimary: palette.deepBlue,
  textSecondary: palette.gray500,
  textMuted: palette.gray400,
  textOnPrimary: palette.white,
  textOnAccent: palette.deepBlue,

  // Bordes / divisores
  border: palette.gray200,
  borderStrong: palette.gray300,

  // Estados
  success: palette.success,
  successSoft: palette.successSoft,
  danger: palette.danger,
  dangerSoft: palette.dangerSoft,
  warning: palette.warning,
  // Egresos: rojo leve (no abrumador) para los montos de gastos.
  expense: "#D45D6E",

  // Utilidad
  white: palette.white,
  black: palette.black,
  overlay: "rgba(30, 31, 63, 0.45)",
} as const;

export type ColorToken = keyof typeof colors;
