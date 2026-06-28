import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Mapa de categoría → ícono de línea (Ionicons), para una estética más sobria
 * que los emojis. Se busca por nombre normalizado (sin tildes ni mayúsculas).
 */
const ICON_BY_CATEGORY: Record<string, IconName> = {
  supermercado: "cart-outline",
  restaurantes: "restaurant-outline",
  cafe: "cafe-outline",
  transporte: "car-outline",
  servicios: "bulb-outline",
  entretenimiento: "film-outline",
  salud: "medkit-outline",
  compras: "bag-handle-outline",
  suscripciones: "tv-outline",
  otros: "pricetag-outline",
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Devuelve el ícono de línea para una categoría (con respaldo genérico). */
export function categoryIcon(name?: string): IconName {
  if (!name) return "pricetag-outline";
  return ICON_BY_CATEGORY[normalize(name)] ?? "pricetag-outline";
}
