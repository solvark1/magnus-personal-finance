import { api } from "@/api/client";
import { TrustedSender } from "@/types/models";

export interface TrustedSenderInput {
  email_address: string;
  display_name: string;
}

export const trustedSendersApi = {
  list: () => api.getPaged<TrustedSender>("/trusted-senders"),

  create: (input: TrustedSenderInput) =>
    api.post<TrustedSender>("/trusted-senders", {
      ...input,
      user_id: "u1",
      is_active: true,
      created_at: new Date().toISOString(),
    }),

  update: (id: string, patch: Partial<TrustedSender>) =>
    api.patch<TrustedSender>(`/trusted-senders/${id}`, patch),

  remove: (id: string) => api.del(`/trusted-senders/${id}`),
};
