/** Contrato de respuestas del API (igual al backend real de Magnus). */

export interface ApiMeta {
  page: number;
  page_size: number;
  total: number;
}

/** Envelope de éxito: el backend siempre envuelve en `data` (+ `meta` en listas). */
export interface ApiEnvelope<T> {
  data: T;
  meta?: ApiMeta;
}

/** Resultado paginado ya desempaquetado para consumo del frontend. */
export interface Paged<T> {
  items: T[];
  meta: ApiMeta;
}

/** Error normalizado (derivado de ProblemDetails RFC 9457). */
export interface ApiError {
  status: number;
  title: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
