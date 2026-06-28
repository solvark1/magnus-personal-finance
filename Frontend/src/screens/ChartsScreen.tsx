import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Magnus } from "@/components/magnus/Magnus";
import { Badge, Text } from "@/components/ui";
import { colors, spacing } from "@/theme";

/**
 * Pestaña de Gráficas. Placeholder intencional: aún no mostramos datos hasta
 * conectar el análisis real con el backend.
 */
export function ChartsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View style={styles.header}>
        <Text variant="h2">Gráficas</Text>
        <Text variant="body" color="textSecondary">
          Análisis de tus gastos por categoría y en el tiempo.
        </Text>
      </View>

      <View style={styles.center}>
        <Magnus size="lg" mood="thinking" />
        <View>
          <Badge label="Próximamente" tone="primary" />
        </View>
        <Text variant="h3" center style={styles.title}>
          Magnus está afilando los lápices
        </Text>
        <Text variant="body" color="textSecondary" center style={styles.msg}>
          Pronto verás aquí tus tendencias de gasto con gráficas claras. Las
          activaremos cuando los datos estén listos.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  title: { marginTop: spacing.sm },
  msg: { maxWidth: 320 },
});
