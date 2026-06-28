import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/theme";

export function Divider({ spaced = false }: { spaced?: boolean }) {
  return <View style={[styles.divider, spaced && styles.spaced]} />;
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.border },
  spaced: { marginVertical: spacing.md },
});
