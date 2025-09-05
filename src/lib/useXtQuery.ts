import { useQuery } from "@tanstack/react-query";
import axios from "../auth/axios";
import type { CategorizedTopic } from "../types/api";
import type { XTResponse } from "../types/topics";

export function useXTQuery(topics: CategorizedTopic[], userIds: number[], halfLabel: "firstHalf" | "secondHalf") {
  return useQuery<XTResponse>({
    queryKey: ["topicsSort", halfLabel, userIds, topics.map(t => t.topic)],
    queryFn: async () => {
      const payload = {
        user_ids: userIds,
        topics: topics.map(t => ({
          name: t.topic,
          category_ids: t.categories.map(c => c.id),
        })),
      };
      const res = await axios.post<XTResponse>("/quizzes/predictor/topics/sort/", payload);
      return res.data;
    },
    enabled: userIds.length > 0 && topics.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
