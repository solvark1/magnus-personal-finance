import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, LoadingScreen, Text } from "@/components/ui";
import { useAuth } from "@/features/auth/AuthContext";
import {
    useCurrentBudget,
    useUpsertBudget,
} from "@/features/budgets/budgets.hooks";
import { BudgetCard } from "@/features/budgets/components/BudgetCard";
import { SetBudgetModal } from "@/features/budgets/components/SetBudgetModal";
import { useCategoryMap } from "@/features/categories/categories.hooks";
import { AddTransactionModal } from "@/features/transactions/components/AddTransactionModal";
import { SummaryHeader } from "@/features/transactions/components/SummaryHeader";
import { TransactionRow } from "@/features/transactions/components/TransactionRow";
import {
    useCreateTransaction,
    useTransactions,
    useTransactionSummary,
} from "@/features/transactions/transactions.hooks";
import { colors, radius, shadows, spacing } from "@/theme";

/** Pantalla principal: saludo, presupuesto y lista de movimientos. */
export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const categories = useCategoryMap();

  const transactions = useTransactions();
  const summary = useTransactionSummary();
  const budget = useCurrentBudget();
  const upsertBudget = useUpsertBudget();
  const createTransaction = useCreateTransaction();

  const [budgetModal, setBudgetModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const refreshing = transactions.isRefetching || summary.isRefetching;
  const onRefresh = useCallback(() => {
    transactions.refetch();
    summary.refetch();
    budget.refetch();
  }, [transactions, summary, budget]);

  if (transactions.isLoading) {
    return <LoadingScreen message="Cargando tus gastos…" />;
  }

  const items = transactions.data?.items ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <FlatList
        data={items}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <SummaryHeader userName={user?.display_name ?? "tú"} />
            {budget.data ? (
              <BudgetCard
                budget={budget.data}
                summary={summary.data}
                onEdit={() => setBudgetModal(true)}
              />
            ) : null}
            <View style={styles.sectionHeader}>
              <Text variant="h3">Movimientos</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && styles.addBtnPressed,
                ]}
                onPress={() => setAddModal(true)}
                accessibilityLabel="Registrar movimiento manual"
              >
                <Ionicons name="add" size={24} color={colors.textOnPrimary} />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionRow
            transaction={item}
            category={
              item.category_id ? categories[item.category_id] : undefined
            }
            onPress={() => router.push(`/transaction/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="Aún no hay gastos"
            message="Sincroniza tu Gmail para que Magnus traiga tus transacciones."
            mood="sleep"
          />
        }
      />

      <SetBudgetModal
        visible={budgetModal}
        currentAmount={budget.data?.amount ?? 0}
        submitting={upsertBudget.isPending}
        onClose={() => setBudgetModal(false)}
        onSubmit={(amount) =>
          upsertBudget.mutate(amount, {
            onSuccess: () => setBudgetModal(false),
          })
        }
      />

      <AddTransactionModal
        visible={addModal}
        submitting={createTransaction.isPending}
        onClose={() => setAddModal(false)}
        onSubmit={(input) =>
          createTransaction.mutate(input, {
            onSuccess: () => setAddModal(false),
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  addBtnPressed: { opacity: 0.9, transform: [{ scale: 0.96 }] },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
});
