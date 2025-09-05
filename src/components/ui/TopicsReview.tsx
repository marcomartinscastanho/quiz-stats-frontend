import type { FC } from "react";
import type { CategorizedTopic } from "../../types/api";

type HalfTopicsReviewProps = {
  topics: CategorizedTopic[];
};

type TopicsReviewProps = {
  firstHalfTopics: CategorizedTopic[];
  secondHalfTopics: CategorizedTopic[];
};

export const HalfTopicsReview: FC<HalfTopicsReviewProps> = ({ topics }) => {
  return (
    <ul className="mb-2">
      {topics.map(t => (
        <li key={t.topic}>
          <h3 className="font-bold">{t.topic}</h3>
          <p className="font-extralight text-sm ml-4">{t.categories.map(c => c.name).join(", ")}</p>
        </li>
      ))}
    </ul>
  );
};

export const TopicsReview: FC<TopicsReviewProps> = ({ firstHalfTopics, secondHalfTopics }) => {
  return (
    <div className="flex flex-col gap-4">
      <HalfTopicsReview topics={firstHalfTopics} />
      <HalfTopicsReview topics={secondHalfTopics} />
    </div>
  );
};
