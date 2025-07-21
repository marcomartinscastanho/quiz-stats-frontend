import type { User } from "./user";

export type PredictedTopicUser = User & {
  predicted_user_xT: number;
};

export type PredictedTopic = {
  topic_name: string;
  predicted_team_xT: number;
  categories: string[];
  users: PredictedTopicUser[];
};

export type PredictedTopicRequest = {
  user_ids: number[];
  topics: string[];
};
export type PredictedTopicResponse = { data: PredictedTopic[] };
