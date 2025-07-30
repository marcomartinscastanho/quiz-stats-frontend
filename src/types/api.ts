import type { Category } from "./categories";

export type CategorizedTopic = {
  topic: string;
  categories: Category[];
};

export type CategorizeResponse = {
  first_half_categories: CategorizedTopic[];
  second_half_categories: CategorizedTopic[];
};
