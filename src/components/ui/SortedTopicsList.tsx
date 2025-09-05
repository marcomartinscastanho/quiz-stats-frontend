import type { FC } from "react";
import type { ScoredTopic } from "../../types/topics";

type Props = {
  label: string;
  topics: ScoredTopic[];
};

export const SortedTopicsList: FC<Props> = ({ label, topics }) => {
  return (
    <div className="flex-1 border rounded-lg">
      <div className="font-semibold border-b px-2 py-1">{label}</div>
      <ul className="divide-y divide-gray-200">
        {topics.map((t, idx) => (
          <li key={idx} className="px-2 py-1 font-extralight text-sm">
            {t.topic}
          </li>
        ))}
      </ul>
    </div>
  );
};
