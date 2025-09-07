import { useQuery } from "@tanstack/react-query";
import axios from "../auth/axios";
import type { CategoryGroup } from "../types/categories";

export const useCategoryGroups = () => {
  const query = useQuery<CategoryGroup[]>({
    queryKey: ["category-groups"],
    queryFn: async () => {
      const res = await axios.get("/quizzes/categories/groups/");
      return res.data;
    },
    staleTime: Infinity,
  });

  // Build a map keyed by ID (memoized so it doesn't rebuild unnecessarily)
  const categoryGroupsById = query.data
    ? new Map(query.data.map(group => [group.id, group]))
    : new Map<number, CategoryGroup>();

  return {
    ...query, // all of React Query's fields (isLoading, error, etc.)
    categoryGroups: query.data ?? [],
    categoryGroupsById,
  };
};
