import type { FC } from "react";
import type { ScoredTopic } from "../../types/topics";

type Props = {
  label: string;
  topics: ScoredTopic[];
};

export const SortedTopicsList: FC<Props> = ({ label, topics }) => {
  return (
    <div className="flex-1 border rounded-lg">
      <div className="flex flex-row justify-between gap-2 font-semibold border-b px-2 py-1">
        <span>{label}</span>
        xT
      </div>
      <ul className="divide-y divide-gray-200">
        {topics.map((t, idx) => (
          <li key={idx} className="flex flex-row justify-between gap-2 px-2 py-1 font-extralight text-sm">
            <span>{t.topic}</span>
            <span className="text-xs">{t.xT.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
