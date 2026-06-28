import { api } from "@/api/client";
import { SyncJob } from "@/types/models";

export interface OAuthStatus {
  connected: boolean;
  email: string;
  expires_at: string;
}

export const gmailApi = {
  oauthStatus: () => api.get<OAuthStatus>("/gmail/oauth/status"),
  syncStatus: () => api.get<SyncJob | null>("/gmail/sync/status"),
  syncHistory: () => api.getPaged<SyncJob>("/gmail/sync/history"),
  triggerSync: () => api.post<SyncJob>("/gmail/sync"),
};
