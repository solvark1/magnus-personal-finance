import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Magnus } from "@/components/magnus/Magnus";
import {
    Badge,
    Button,
    Card,
    Divider,
    LoadingScreen,
    Text,
    useConfirm,
} from "@/components/ui";
import { useCategoryMap } from "@/features/categories/categories.hooks";
import { categoryIcon } from "@/features/transactions/categoryIcons";
import {
    useDeleteTransaction,
    useToggleReviewed,
    useTransaction,
} from "@/features/transactions/transactions.hooks";
import { capitalize, formatCurrency, formatDate } from "@/lib/format";
import { colors, radius, spacing } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const categories = useCategoryMap();
  const confirm = useConfirm();

  const { data: tx, isLoading } = useTransaction(id);
  const toggleReviewed = useToggleReviewed();
  const deleteTx = useDeleteTransaction();

  if (isLoading || !tx) return <LoadingScreen />;

  const category = tx.category_id ? categories[tx.category_id] : undefined;

  async function handleDelete() {
    const ok = await confirm({
      title: "Eliminar gasto",
      message: "¿Seguro que quieres eliminar este movimiento?",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteTx.mutate(id, { onSuccess: () => router.back() });
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text variant="title">Detalle</Text>
        <View style={styles.closeBtn} />
      </View>

      <View style={styles.body}>
        <View style={styles.hero}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor:
                  (category?.color_hex ?? colors.textMuted) + "1A",
              },
            ]}
          >
            <Ionicons
              name={categoryIcon(category?.name)}
              size={32}
              color={category?.color_hex ?? colors.textMuted}
            />
          </View>
          <Text
            variant="display"
            color={tx.transaction_type === "income" ? "success" : "expense"}
          >
            {tx.transaction_type === "income" ? "+" : "-"}
            {formatCurrency(tx.amount, tx.currency)}
          </Text>
          <Text variant="h3" color="textSecondary">
            {tx.merchant_name}
          </Text>
          <Badge
            label={tx.is_reviewed ? "Revisado" : "Sin revisar"}
            tone={tx.is_reviewed ? "success" : "accent"}
            style={styles.badge}
          />
        </View>

        <Card style={styles.details}>
          <DetailRow
            label="Categoría"
            value={category?.name ?? "Sin categoría"}
          />
          <Divider />
          <DetailRow label="Fecha" value={formatDate(tx.transaction_date)} />
          <Divider />
          <DetailRow label="Descripción" value={tx.description || "—"} />
          <Divider />
          <DetailRow label="Origen" value={capitalize(tx.source)} />
          <Divider />
          <DetailRow
            label="Detección"
            value={capitalize(tx.parsing_method ?? "manual")}
          />
        </Card>

        <View style={styles.note}>
          <Magnus size="sm" mood="thinking" bounce={false} />
          <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
            Magnus extrajo este gasto de un correo. Si algo no cuadra, márcalo
            como revisado o edítalo.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={tx.is_reviewed ? "Marcar sin revisar" : "Marcar revisado"}
          variant="secondary"
          fullWidth
          loading={toggleReviewed.isPending}
          onPress={() =>
            toggleReviewed.mutate({ id, is_reviewed: !tx.is_reviewed })
          }
        />
        <Button
          label="Eliminar"
          variant="highlight"
          fullWidth
          loading={deleteTx.isPending}
          onPress={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodyMedium" color="textSecondary">
        {label}
      </Text>
      <Text variant="bodyMedium" color="textPrimary" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, paddingHorizontal: spacing.lg, gap: spacing.xl },
  hero: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
  badge: { alignSelf: "center" },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  details: { gap: spacing.sm },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.xs,
  },
  detailValue: { flex: 1, textAlign: "right" },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  actions: { padding: spacing.lg, gap: spacing.md },
});
