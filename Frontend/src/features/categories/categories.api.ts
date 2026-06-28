import { api } from "@/api/client";
import { Category } from "@/types/models";

export const categoriesApi = {
  list: () => api.getPaged<Category>("/categories"),
};
