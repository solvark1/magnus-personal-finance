import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { colors, radius, spacing } from "@/theme";
import { Text } from "./Text";

type Variant =
  | "primary"
  | "brand"
  | "accent"
  | "highlight"
  | "secondary"
  | "danger"
  | "ghost";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const VARIANTS: Record<
  Variant,
  { bg: string; text: keyof typeof colors; border?: string }
> = {
  primary: { bg: colors.primary, text: "textOnPrimary" },
  brand: { bg: colors.brand, text: "textOnPrimary" },
  accent: { bg: colors.accent, text: "textOnAccent" },
  highlight: { bg: colors.highlight, text: "textOnPrimary" },
  secondary: { bg: colors.surface, text: "textPrimary", border: colors.border },
  danger: { bg: colors.danger, text: "textOnPrimary" },
  ghost: { bg: "transparent", text: "primary" },
};

/** Botón plano, limpio y moderno. Feedback sutil de presión (sin relieve 3D). */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  fullWidth,
  icon,
  style,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const pressed = useSharedValue(0);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(1 - pressed.value * 0.03, { duration: 90 }) },
    ],
    opacity: withTiming(1 - pressed.value * 0.12, { duration: 90 }),
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={fullWidth ? styles.fullWidth : styles.hug}
    >
      <Animated.View
        style={[
          styles.button,
          animatedStyle,
          {
            backgroundColor: v.bg,
            borderWidth: v.border ? 1.5 : 0,
            borderColor: v.border ?? "transparent",
          },
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors[v.text]} />
        ) : (
          <View style={styles.content}>
            {icon}
            <Text variant="button" color={v.text}>
              {label}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: { alignSelf: "stretch" },
  hug: { alignSelf: "flex-start" },
  disabled: { opacity: 0.45 },
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
