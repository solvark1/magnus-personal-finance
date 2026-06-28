import { StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Text } from "./Text";

type Tone = "neutral" | "primary" | "success" | "danger" | "accent";

const TONES: Record<Tone, { bg: string; fg: keyof typeof colors }> = {
  neutral: { bg: colors.surfaceAlt, fg: "textSecondary" },
  primary: { bg: colors.primarySoft, fg: "primary" },
  success: { bg: colors.successSoft, fg: "success" },
  danger: { bg: colors.dangerSoft, fg: "danger" },
  accent: { bg: colors.accent, fg: "textOnAccent" },
};

export function Badge({
  label,
  tone = "neutral",
  style,
}: {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
}) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text variant="caption" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
});
