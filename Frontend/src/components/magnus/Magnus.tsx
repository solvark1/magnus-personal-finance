import { useEffect } from "react";
import { Image, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/Text";
import { colors, radius, shadows, spacing } from "@/theme";
import { MagnusMood, magnusImages } from "./magnusImages";

type Size = "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, number> = { sm: 44, md: 84, lg: 132, xl: 176 };

interface MagnusProps {
  size?: Size;
  /** Estado de ánimo de la mascota. */
  mood?: MagnusMood;
  /** Mensaje en globo de diálogo (opcional). */
  message?: string;
  bounce?: boolean;
  style?: ViewStyle;
}

/**
 * Magnus, la mascota (beagle). Renderiza la ilustración según el estado de
 * ánimo, con una animación de rebote sutil y opcional.
 */
export function Magnus({
  size = "md",
  mood = "happy",
  message,
  bounce = true,
  style,
}: MagnusProps) {
  const dim = SIZES[size];
  const image = magnusImages[mood];
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!bounce) return;
    offset.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [bounce, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <View style={[styles.container, style]}>
      {message ? (
        <View style={styles.bubble}>
          <Text variant="bodyMedium" color="textPrimary" center>
            {message}
          </Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      <Animated.View style={animatedStyle}>
        <Image
          source={image}
          style={{ width: dim, height: dim }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    maxWidth: 280,
    ...shadows.soft,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -7,
    alignSelf: "center",
    width: 14,
    height: 14,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    transform: [{ rotate: "45deg" }],
  },
});
