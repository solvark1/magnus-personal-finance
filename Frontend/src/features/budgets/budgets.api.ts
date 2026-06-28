import { api } from "@/api/client";
import type { Budget } from "@/types/models";

export const budgetsApi = {
  current: () => api.get<Budget>("/budgets/current"),
  upsert: (amount: number) => api.put<Budget>("/budgets/current", { amount }),
};
