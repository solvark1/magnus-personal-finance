import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { Card, Text } from "@/components/ui";
import { colors, radius, spacing } from "@/theme";
import { TrustedSender } from "@/types/models";

interface Props {
  sender: TrustedSender;
  onToggle: (active: boolean) => void;
  onDelete: () => void;
}

/** Tarjeta de remitente confiable con switch de activación y borrado. */
export function SenderCard({ sender, onToggle, onDelete }: Props) {
  // Estado local optimista: el switch refleja el cambio al instante y evita
  // el "flash" de ida y vuelta mientras la mutación va al servidor.
  const [active, setActive] = useState(sender.is_active);

  useEffect(() => {
    setActive(sender.is_active);
  }, [sender.is_active]);

  const handleToggle = (value: boolean) => {
    setActive(value);
    onToggle(value);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { opacity: active ? 1 : 0.4 }]}>
          <Ionicons name="business" size={20} color={colors.primary} />
        </View>

        <View style={styles.info}>
          <Text variant="title" numberOfLines={1}>
            {sender.display_name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {sender.email_address}
          </Text>
        </View>

        <Switch
          value={active}
          onValueChange={handleToggle}
          trackColor={{ true: colors.primary, false: colors.borderStrong }}
          thumbColor={colors.white}
        />
      </View>

      <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text variant="caption" color="danger">
          Eliminar
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  delete: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
  },
});
