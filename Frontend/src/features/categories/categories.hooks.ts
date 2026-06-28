import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { queryKeys } from "@/api/keys";
import { Category } from "@/types/models";
import { categoriesApi } from "./categories.api";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60_000,
  });
}

/** Mapa id -> Category para resolver la categoría de cada transacción. */
export function useCategoryMap(): Record<string, Category> {
  const { data } = useCategories();
  return useMemo(() => {
    const map: Record<string, Category> = {};
    data?.items.forEach((c) => (map[c.id] = c));
    return map;
  }, [data]);
}
