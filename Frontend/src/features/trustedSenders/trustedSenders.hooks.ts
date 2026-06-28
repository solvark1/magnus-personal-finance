import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/keys";
import { TrustedSender } from "@/types/models";
import { TrustedSenderInput, trustedSendersApi } from "./trustedSenders.api";

export function useTrustedSenders() {
  return useQuery({
    queryKey: queryKeys.trustedSenders.all,
    queryFn: () => trustedSendersApi.list(),
  });
}

export function useCreateTrustedSender() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TrustedSenderInput) => trustedSendersApi.create(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.trustedSenders.all }),
  });
}

export function useUpdateTrustedSender() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<TrustedSender>;
    }) => trustedSendersApi.update(id, patch),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.trustedSenders.all }),
  });
}

export function useDeleteTrustedSender() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trustedSendersApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.trustedSenders.all }),
  });
}
