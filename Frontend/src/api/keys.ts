/**
 * Claves de React Query centralizadas para evitar strings mágicos y
 * facilitar invalidaciones consistentes.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (filters?: object) =>
      ["transactions", "list", filters ?? {}] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
    summary: ["transactions", "summary"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  budgets: {
    current: ["budgets", "current"] as const,
  },
  trustedSenders: {
    all: ["trusted-senders"] as const,
  },
  gmail: {
    syncStatus: ["gmail", "sync", "status"] as const,
    syncHistory: ["gmail", "sync", "history"] as const,
    oauthStatus: ["gmail", "oauth", "status"] as const,
  },
} as const;
