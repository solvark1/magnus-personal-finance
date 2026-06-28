import { QueryClient } from "@tanstack/react-query";

/** Cliente de React Query con defaults razonables para una app móvil. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
