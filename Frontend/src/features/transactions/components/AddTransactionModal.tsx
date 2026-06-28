import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { BottomSheet, Button, Input, Text } from "@/components/ui";
import { useCategories } from "@/features/categories/categories.hooks";
import type { CreateTransactionInput } from "@/features/transactions/transactions.api";
import { colors, radius, spacing } from "@/theme";

interface Props {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTransactionInput) => void;
}

type TxType = "expense" | "income";

/** Hoja inferior para registrar un movimiento manual (efectivo, ingresos). */
export function AddTransactionModal({
  visible,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const { data: categories } = useCategories();
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setType("expense");
      setAmount("");
      setMerchant("");
      setCategoryId(null);
      setError(undefined);
    }
  }, [visible]);

  function handleSubmit() {
    const value = Number(amount.replace(/[^\d.]/g, ""));
    if (!value || value <= 0) {
      return setError("Ingresa un monto mayor a cero.");
    }
    onSubmit({
      amount: Math.round(value),
      transaction_type: type,
      merchant_name:
        merchant.trim() ||
        (type === "income" ? "Ingreso manual" : "Gasto en efectivo"),
      category_id: type === "expense" ? categoryId : null,
    });
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text variant="h3">Registrar movimiento</Text>

      {/* Selector de tipo */}
      <View style={styles.toggle}>
        {(["expense", "income"] as TxType[]).map((t) => {
          const active = type === t;
          return (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.toggleBtn, active && styles.toggleBtnActive]}
            >
              <Text
                variant="button"
                color={active ? "textOnPrimary" : "textSecondary"}
              >
                {t === "expense" ? "Gasto" : "Ingreso"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.form}>
        <Input
          label="Monto (₡)"
          placeholder="12500"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(t) => {
            setAmount(t);
            setError(undefined);
          }}
          error={error}
        />
        <Input
          label={type === "income" ? "Concepto" : "Comercio o detalle"}
          placeholder={
            type === "income" ? "Salario, venta…" : "Soda, taxi, feria…"
          }
          value={merchant}
          onChangeText={setMerchant}
        />
      </View>

      {/* Categorías (solo para gastos) */}
      {type === "expense" && categories?.items?.length ? (
        <View style={styles.categories}>
          <Text variant="label" color="textSecondary">
            Categoría
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {categories.items.map((cat) => {
              const active = categoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategoryId(active ? null : cat.id)}
                  style={[
                    styles.chip,
                    active && {
                      backgroundColor: (cat.color_hex ?? colors.primary) + "1A",
                      borderColor: cat.color_hex ?? colors.primary,
                    },
                  ]}
                >
                  <Text
                    variant="label"
                    color={active ? "textPrimary" : "textSecondary"}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.disclaimer}>
        <Text variant="caption" color="textSecondary">
          {type === "income"
            ? "Registra un ingreso adicional fuera de tu presupuesto. El mismo se sumará al presupuesto de este mes."
            : "Esta opción es ideal para gastos en efectivo que no pueden ser detectados automáticamente."}
        </Text>
      </View>

      <Button
        label="Guardar movimiento"
        fullWidth
        loading={submitting}
        onPress={handleSubmit}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: colors.primary },
  form: { gap: spacing.md },
  categories: { gap: spacing.sm },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  disclaimer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
