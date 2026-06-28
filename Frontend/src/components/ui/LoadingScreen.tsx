import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Magnus } from "@/components/magnus/Magnus";
import { colors, spacing } from "@/theme";
import { Text } from "./Text";

/** Pantalla de carga a pantalla completa, consistente con la marca. */
export function LoadingScreen({ message }: { message?: string }) {
  return (
    <View style={styles.container}>
      <Magnus size="lg" mood="sleep" />
      <ActivityIndicator color={colors.primary} />
      {message ? (
        <Text variant="bodyMedium" color="textSecondary">
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
});
