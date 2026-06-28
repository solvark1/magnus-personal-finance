import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomSheet, Button, Input, Text } from "@/components/ui";
import { spacing } from "@/theme";

interface Props {
  visible: boolean;
  currentAmount: number;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

/** Hoja inferior para definir o editar el presupuesto del mes. */
export function SetBudgetModal({
  visible,
  currentAmount,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setAmount(currentAmount > 0 ? String(currentAmount) : "");
      setError(undefined);
    }
  }, [visible, currentAmount]);

  function handleSubmit() {
    const value = Number(amount.replace(/[^\d.]/g, ""));
    if (!value || value <= 0) {
      return setError("Ingresa un monto mayor a cero.");
    }
    onSubmit(Math.round(value));
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text variant="h3">Presupuesto mensual</Text>
      <Text variant="body" color="textSecondary">
        Define cuánto quieres gastar este mes y Magnus te ayuda a no pasarte.
      </Text>

      <View style={styles.form}>
        <Input
          label="Monto (₡)"
          placeholder="450000"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(t) => {
            setAmount(t);
            setError(undefined);
          }}
          error={error}
        />
      </View>

      <Button
        label="Guardar presupuesto"
        fullWidth
        loading={submitting}
        onPress={handleSubmit}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
});
