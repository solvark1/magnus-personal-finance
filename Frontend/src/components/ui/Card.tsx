import {
    Pressable,
    StyleSheet,
    View,
    ViewProps,
    ViewStyle,
} from "react-native";

import { colors, radius, shadows, spacing } from "@/theme";

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: ViewStyle;
}

/** Superficie blanca redondeada con sombra suave. Bloque base de la UI. */
export function Card({
  children,
  onPress,
  padded = true,
  style,
  ...rest
}: CardProps) {
  const content = (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.96, transform: [{ scale: 0.985 }] },
});
