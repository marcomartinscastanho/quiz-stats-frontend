import { useMemo, type FC } from "react";
import { useXTQuery } from "../../lib/useXtQuery";
import type { CategorizedTopic } from "../../types/api";
import type { User } from "../../types/user";
import { HalfSeparator } from "./HalfSeparator";
import { SortedTopicsList } from "./SortedTopicsList";

type Props = {
  users: User[];
  firstHalfTopics: CategorizedTopic[];
  secondHalfTopics: CategorizedTopic[];
};

export const SortedTopics: FC<Props> = ({ users, firstHalfTopics, secondHalfTopics }) => {
  const userIds = useMemo(() => users.map(u => u.id), [users]);
  const userIdMap = useMemo(() => {
    const map: Record<number, User> = {};
    users.forEach(user => {
      map[user.id] = user;
    });
    return map;
  }, [users]);
  const xtFirstHalfQuery = useXTQuery(firstHalfTopics, userIds, "firstHalf");
  const xtSecondHalfQuery = useXTQuery(secondHalfTopics, userIds, "secondHalf");

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Sorted Topics</h2>
      <HalfSeparator label="First Half" />
      {!!xtFirstHalfQuery.data && (
        <div className="flex flex-row gap-1">
          <SortedTopicsList label="Team" topics={xtFirstHalfQuery.data.team.topics} />
          {xtFirstHalfQuery.data.users.map(u => (
            <SortedTopicsList label={userIdMap[u.user_id].username} topics={u.topics} />
          ))}
        </div>
      )}
      <HalfSeparator label="Second Half" />
      {!!xtSecondHalfQuery.data && (
        <div className="flex flex-row gap-1">
          <SortedTopicsList label="Team" topics={xtSecondHalfQuery.data.team.topics} />
          {xtSecondHalfQuery.data.users.map(u => (
            <SortedTopicsList label={userIdMap[u.user_id].username} topics={u.topics} />
          ))}
        </div>
      )}
    </div>
  );
};
