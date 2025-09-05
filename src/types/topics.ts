export type ScoredTopic = {
  topic: string;
  xT: number;
};

export type XTResponse = {
  team: {
    topics: ScoredTopic[];
  };
  users: {
    user_id: number;
    topics: ScoredTopic[];
  }[];
};
