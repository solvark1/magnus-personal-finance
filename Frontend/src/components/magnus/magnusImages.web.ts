import { ImageSourcePropType } from "react-native";

/**
 * Variante WEB de las ilustraciones de Magnus. En web sí podemos usar SVG
 * (se ven más nítidos). Metro resuelve este archivo `.web` automáticamente
 * cuando la plataforma es web; en móvil usa `magnusImages.ts` (PNG).
 */
export type MagnusMood = "happy" | "wave" | "thinking" | "celebrate" | "sleep";

const happy: ImageSourcePropType = require("@/assets/magnus/magnus-happy.svg");
const sleep: ImageSourcePropType = require("@/assets/magnus/magnus-sleep.svg");

/** Mapa de estado de ánimo → ilustración. */
export const magnusImages: Record<MagnusMood, ImageSourcePropType> = {
  happy,
  wave: happy,
  thinking: happy,
  celebrate: happy,
  sleep,
};

/** Logotipo horizontal de marca ("M" + "Magnus."). */
export const magnusLogo: ImageSourcePropType = require("@/assets/magnus/logo-horizontal.svg");

/** Retrato de perfil de Magnus (vista de lado) — usado como avatar. */
export const magnusProfile: ImageSourcePropType = require("@/assets/magnus/magnus-from-the-side.svg");
