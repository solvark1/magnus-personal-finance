import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/keys";
import { gmailApi } from "./gmailSync.api";

export function useOAuthStatus() {
  return useQuery({
    queryKey: queryKeys.gmail.oauthStatus,
    queryFn: () => gmailApi.oauthStatus(),
  });
}

export function useSyncStatus() {
  return useQuery({
    queryKey: queryKeys.gmail.syncStatus,
    queryFn: () => gmailApi.syncStatus(),
  });
}

export function useSyncHistory() {
  return useQuery({
    queryKey: queryKeys.gmail.syncHistory,
    queryFn: () => gmailApi.syncHistory(),
  });
}

export function useTriggerSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => gmailApi.triggerSync(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.gmail.syncStatus });
      qc.invalidateQueries({ queryKey: queryKeys.gmail.syncHistory });
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.transactions.summary });
    },
  });
}
