import { ImageSourcePropType } from "react-native";

/**
 * Ilustraciones de Magnus (el beagle) — identidad propia de la app.
 * Las imágenes viven en `assets/magnus/`.
 */
export type MagnusMood = "happy" | "wave" | "thinking" | "celebrate" | "sleep";

// En móvil usamos PNG (React Native no rasteriza SVG con <Image>). La versión
// web usa los SVG vía magnusImages.web.ts (Metro resuelve el sufijo .web).
const happy: ImageSourcePropType = require("@/assets/magnus/magnus-happy.png");
const sleep: ImageSourcePropType = require("@/assets/magnus/magnus-sleep.png");

/** Mapa de estado de ánimo → ilustración. */
export const magnusImages: Record<MagnusMood, ImageSourcePropType> = {
  happy,
  wave: happy,
  thinking: happy,
  celebrate: happy,
  sleep,
};

/** Logotipo horizontal de marca ("M" + "Magnus."). */
export const magnusLogo: ImageSourcePropType = require("@/assets/magnus/logo-horizontal.png");

/** Retrato de perfil de Magnus (vista de lado) — usado como avatar. */
export const magnusProfile: ImageSourcePropType = require("@/assets/magnus/magnus-from-the-side.png");
