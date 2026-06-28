import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { STORAGE_KEYS, storage } from "@/lib/storage";
import { ApiEnvelope, ApiError, Paged } from "./types";

/**
 * Cliente HTTP central. Único punto que conoce axios y el formato del backend.
 * El resto de la app consume `api.get/post/...` que ya devuelven datos limpios.
 */
const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Inyecta el token JWT (Bearer) en cada petición autenticada.
http.interceptors.request.use(async (config) => {
  const token = await storage.get(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza cualquier error a nuestra forma `ApiError`.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const data = error.response?.data;
    const normalized: ApiError = {
      status: error.response?.status ?? 0,
      title: data?.title ?? error.message ?? "Error de red",
      detail: data?.detail,
      errors: data?.errors,
    };
    return Promise.reject(normalized);
  },
);

/** Desempaqueta `{ data }` → `data`. */
async function unwrap<T>(
  promise: Promise<{ data: ApiEnvelope<T> }>,
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export const api = {
  /** GET que devuelve el objeto/array dentro de `data`. */
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(http.get(url, config)),

  /** GET de lista paginada: devuelve `{ items, meta }`. */
  async getPaged<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Paged<T>> {
    const res = await http.get<ApiEnvelope<T[]>>(url, config);
    return {
      items: res.data.data,
      meta: res.data.meta ?? {
        page: 1,
        page_size: res.data.data.length,
        total: res.data.data.length,
      },
    };
  },

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(http.post(url, body, config)),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(http.patch(url, body, config)),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(http.put(url, body, config)),

  del: (url: string, config?: AxiosRequestConfig) =>
    http.delete(url, config).then(() => undefined),
};

export { http };

