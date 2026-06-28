import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleSheet,
} from "react-native";

import { colors, ColorToken, TextVariant, textVariants } from "@/theme";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ColorToken;
  center?: boolean;
}

/**
 * Texto base de la app. Aplica la tipografía del design system + variantes.
 * Usar SIEMPRE este componente en lugar del Text de react-native.
 */
export function Text({
  variant = "body",
  color = "textPrimary",
  center,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[
        textVariants[variant],
        { color: colors[color] },
        center && styles.center,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
});
