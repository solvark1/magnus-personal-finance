import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/keys";

import { budgetsApi } from "./budgets.api";

/** Presupuesto del mes actual con lo gastado hasta el momento. */
export function useCurrentBudget() {
  return useQuery({
    queryKey: queryKeys.budgets.current,
    queryFn: budgetsApi.current,
  });
}

/** Define o actualiza el presupuesto del mes actual. */
export function useUpsertBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => budgetsApi.upsert(amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.budgets.current });
    },
  });
}
