import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/keys";
import {
    CreateTransactionInput,
    TransactionFilters,
    transactionsApi,
} from "./transactions.api";

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsApi.list(filters),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsApi.detail(id),
    enabled: !!id,
  });
}

export function useTransactionSummary() {
  return useQuery({
    queryKey: queryKeys.transactions.summary,
    queryFn: () => transactionsApi.summary(),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.transactions.summary });
      qc.invalidateQueries({ queryKey: queryKeys.budgets.current });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.transactions.summary });
    },
  });
}

export function useToggleReviewed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_reviewed }: { id: string; is_reviewed: boolean }) =>
      transactionsApi.update(id, { is_reviewed }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({
        queryKey: queryKeys.transactions.detail(vars.id),
      });
    },
  });
}
