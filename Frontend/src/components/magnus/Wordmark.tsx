import { Image } from "react-native";

import { magnusLogo } from "./magnusImages";

const ASPECT_RATIO = 1000 / 269;

interface Props {
  /** Altura del logotipo en px (el ancho se ajusta solo). */
  height?: number;
}

/** Logotipo horizontal de Magnus ("M" + "Magnus.") usando el arte de marca. */
export function Wordmark({ height = 34 }: Props) {
  return (
    <Image
      source={magnusLogo}
      style={{ height, width: height * ASPECT_RATIO }}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Magnus"
    />
  );
}
