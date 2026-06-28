import { api } from "@/api/client";
import { Transaction, TransactionSummary } from "@/types/models";

export interface TransactionFilters {
  page?: number;
  page_size?: number;
  sort?: string;
  q?: string;
  category_id?: string;
  date_from?: string;
  date_to?: string;
}

const DEFAULTS: TransactionFilters = {
  sort: "transaction_date_desc",
};

export interface CreateTransactionInput {
  amount: number;
  transaction_type: "expense" | "income";
  merchant_name: string;
  description?: string;
  category_id?: string | null;
  transaction_date?: string;
  currency?: string;
}

export const transactionsApi = {
  list: (filters: TransactionFilters = {}) =>
    api.getPaged<Transaction>("/transactions", {
      params: { is_deleted: false, ...DEFAULTS, ...filters },
    }),

  detail: (id: string) => api.get<Transaction>(`/transactions/${id}`),

  summary: () => api.get<TransactionSummary>("/transactions/summary"),

  create: (input: CreateTransactionInput) =>
    api.post<Transaction>("/transactions", input),

  update: (id: string, patch: Partial<Transaction>) =>
    api.patch<Transaction>(`/transactions/${id}`, patch),

  remove: (id: string) => api.del(`/transactions/${id}`),
};
