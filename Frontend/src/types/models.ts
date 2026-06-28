/** Modelos de dominio — reflejan el esquema del backend (en inglés, como la DB). */

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  locale: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color_hex: string;
  is_system: boolean;
  is_active: boolean;
}

export type TransactionType = "expense" | "income";
export type TransactionSource = "gmail" | "manual";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  currency: string;
  description: string;
  merchant_name: string;
  source: TransactionSource;
  transaction_type: TransactionType;
  transaction_date: string;
  parsing_method?: string;
  is_reviewed: boolean;
  is_deleted: boolean;
}

export interface TrustedSender {
  id: string;
  user_id: string;
  email_address: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
}

export type SyncStatus = "pending" | "running" | "completed" | "failed";

export interface SyncJob {
  id: string;
  user_id: string;
  status: SyncStatus;
  emails_fetched: number;
  transactions_created: number;
  error_message: string | null;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface CategoryBreakdown {
  category_id: string;
  category_name: string;
  icon: string;
  color_hex: string;
  amount: number;
}

export interface TransactionSummary {
  total_spent: number;
  currency: string;
  transaction_count: number;
  by_category: CategoryBreakdown[];
}

export interface Budget {
  id: string | null;
  month: string; // "YYYY-MM"
  amount: number;
  currency: string;
  spent: number;
  income: number; // ingresos extra del mes, se suman al monto disponible
  days_left: number;
}
