import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/format";
import { colors, radius, spacing } from "@/theme";
import { Category, Transaction } from "@/types/models";
import { categoryIcon } from "../categoryIcons";

interface Props {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
}

/** Fila de transacción minimalista: ícono + comercio + monto, sin tarjeta. */
export function TransactionRow({ transaction, category, onPress }: Props) {
  const sign = transaction.transaction_type === "income" ? "+" : "-";
  const amountColor =
    transaction.transaction_type === "income" ? "success" : "expense";
  const tint = category?.color_hex ?? colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: tint + "1A" }]}>
        <Ionicons name={categoryIcon(category?.name)} size={20} color={tint} />
      </View>

      <View style={styles.info}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {transaction.merchant_name}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {category?.name ?? "Sin categoría"} ·{" "}
          {formatDate(transaction.transaction_date)}
        </Text>
      </View>

      <View style={styles.amountBox}>
        <Text variant="bodyMedium" color={amountColor}>
          {sign}
          {formatCurrency(transaction.amount, transaction.currency)}
        </Text>
        {!transaction.is_reviewed ? <View style={styles.dot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.55 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  amountBox: { alignItems: "flex-end", gap: 5 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
