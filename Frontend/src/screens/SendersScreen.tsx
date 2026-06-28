import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, LoadingScreen, Text, useConfirm } from "@/components/ui";
import { AddSenderModal } from "@/features/trustedSenders/components/AddSenderModal";
import { SenderCard } from "@/features/trustedSenders/components/SenderCard";
import {
    useCreateTrustedSender,
    useDeleteTrustedSender,
    useTrustedSenders,
    useUpdateTrustedSender,
} from "@/features/trustedSenders/trustedSenders.hooks";
import { colors, radius, spacing } from "@/theme";

/** Pestaña de remitentes confiables (bancos). */
export function SendersScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading } = useTrustedSenders();
  const create = useCreateTrustedSender();
  const update = useUpdateTrustedSender();
  const remove = useDeleteTrustedSender();
  const confirm = useConfirm();

  if (isLoading) return <LoadingScreen message="Cargando remitentes…" />;

  const senders = data?.items ?? [];

  async function confirmDelete(id: string, name: string) {
    const ok = await confirm({
      title: "Eliminar remitente",
      message: `¿Eliminar "${name}"?`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) remove.mutate(id);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <FlatList
        data={senders}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text variant="h2">Remitentes</Text>
                <Text variant="body" color="textSecondary">
                  Correos confiables de tus bancos
                </Text>
              </View>
              <Pressable
                style={styles.addBtn}
                onPress={() => setModalVisible(true)}
                hitSlop={8}
              >
                <Ionicons name="add" size={26} color={colors.white} />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <SenderCard
            sender={item}
            onToggle={(is_active) =>
              update.mutate({ id: item.id, patch: { is_active } })
            }
            onDelete={() => confirmDelete(item.id, item.display_name)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="Sin remitentes aún"
            message="Agrega el correo de tu banco para que Magnus sepa dónde buscar."
            actionLabel="Agregar remitente"
            onAction={() => setModalVisible(true)}
          />
        }
      />

      <AddSenderModal
        visible={modalVisible}
        submitting={create.isPending}
        onClose={() => setModalVisible(false)}
        onSubmit={(input) =>
          create.mutate(input, { onSuccess: () => setModalVisible(false) })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { marginBottom: spacing.lg, paddingTop: spacing.sm },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: { height: spacing.md },
});
