import { useEffect, useMemo, useState } from "react";
import axios from "../../auth/axios";
import { CategoryStatsRadarChart } from "../../components/CategoryStatsRadarChart";
import { Button } from "../../components/ui/Button";
import { StatToggle } from "../../components/ui/StatToggle";
import { colors } from "../../constants";
import { flattenCategories, sortCategoryStats } from "../../lib/utils";
import type { CategorizedTopic } from "../../types/api";
import type { CategoryStat, CategorySummary } from "../../types/categories";
import type { UserAptitude } from "../../types/predictor";
import type { Team, User } from "../../types/user";

export type DataSet = {
  label: string;
  color: string;
  data: CategoryStat[];
};

type Props = {
  team: Team | null;
  users: User[];
  firstHalfTopics: CategorizedTopic[];
  secondHalfTopics: CategorizedTopic[];
  onPrev: () => void;
};

export const Step4: React.FC<Props> = ({ firstHalfTopics, secondHalfTopics, team, users, onPrev }) => {
  const [isTeamSelected, setIsTeamSelected] = useState<boolean>(!!team);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(users.map(u => u.id));
  const [userStats, setUserStats] = useState<Record<number, CategoryStat[]>>({});
  const [teamStats, setTeamStats] = useState<CategoryStat[]>([]);
  const [userAptitudes, setUserAptitudes] = useState<Record<number, number>>({});

  const allTopics = useMemo(() => [...firstHalfTopics, ...secondHalfTopics], [firstHalfTopics, secondHalfTopics]);
  const categorySummaries = useMemo(() => {
    const categoryMap = allTopics.reduce<Map<number, CategorySummary>>((acc, { topic, categories }) => {
      categories.forEach(category => {
        if (!acc.has(category.id)) {
          acc.set(category.id, {
            category,
            count: 1,
            topics: [topic],
          });
        } else {
          const entry = acc.get(category.id)!;
          entry.count += 1;
          if (!entry.topics.includes(topic)) {
            entry.topics.push(topic);
          }
        }
      });
      return acc;
    }, new Map());

    return Array.from(categoryMap.values()).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.category.name.localeCompare(b.category.name);
    });
  }, [allTopics]);
  const categoryIds = useMemo(() => categorySummaries.map(catSum => catSum.category.id), [categorySummaries]);
  const userIds = useMemo(() => users.map(u => u.id), [users]);
  const expandedCategoryIds = useMemo(() => flattenCategories(categorySummaries), [categorySummaries]);

  useEffect(() => {
    const fetchUserStats = async () => {
      Promise.all(selectedUserIds.map(userId => axios.get<CategoryStat[]>(`/users/${userId}/stats/categories/`))).then(
        results => {
          const newStats: Record<string, CategoryStat[]> = {};
          selectedUserIds.forEach((id, index) => {
            newStats[id] = results[index].data
              .filter(stat => categoryIds.includes(stat.category_id))
              .sort(sortCategoryStats(categorySummaries));
          });
          setUserStats(newStats);
        }
      );
    };

    if (selectedUserIds.length > 0) {
      fetchUserStats();
    }
  }, [categoryIds, categorySummaries, selectedUserIds]);

  useEffect(() => {
    const fetchAptitudes = async () => {
      axios
        .post<UserAptitude[]>("/quizzes/predictor/order-of-play/", {
          user_ids: userIds,
          category_ids: expandedCategoryIds,
        })
        .then(result =>
          result.data.reduce<Record<number, number>>((acc, { user_id, aptitude }) => {
            acc[user_id] = aptitude;
            return acc;
          }, {})
        )
        .then(setUserAptitudes);
    };

    if (expandedCategoryIds.length > 0 && userIds.length > 0) {
      fetchAptitudes();
    }
  }, [expandedCategoryIds, userIds]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      if (!team) {
        return;
      }
      axios
        .get<CategoryStat[]>(`/teams/${team.id}/stats/categories/`)
        .then(res =>
          setTeamStats(
            res.data.filter(stat => categoryIds.includes(stat.category_id)).sort(sortCategoryStats(categorySummaries))
          )
        );
    };

    fetchTeamStats();
  }, [categoryIds, categorySummaries, team]);

  const toggleTeam = async () => setIsTeamSelected(isSelected => !isSelected);
  const toggleUser = async (userId: number) => {
    const alreadySelected = selectedUserIds.includes(userId);
    if (alreadySelected) {
      setSelectedUserIds(ids => ids.filter(id => id !== userId));
    } else {
      setSelectedUserIds(ids => [...ids, userId]);
    }
  };

  const datasets = useMemo(() => {
    const users = team ? team.users.filter(u => selectedUserIds.includes(u.id)) : [];
    const data: DataSet[] = [];
    if (isTeamSelected && !!team) {
      data.push({
        label: team.name,
        color: colors[-1],
        data: teamStats,
      });
    }
    return data.concat([
      ...users.map((user, index) => ({
        label: user.username,
        color: colors[index % colors.length],
        data: userStats[user.id] || [],
      })),
    ]);
  }, [isTeamSelected, selectedUserIds, team, teamStats, userStats]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Review</h2>
          {categorySummaries.map(({ category, count, topics }) => (
            <div key={category.id} className="mb-1">
              <h3 className="font-bold">
                {category.name} {count > 1 && `(x${count})`}
              </h3>
              <span className="font-extralight text-sm ml-4">{topics.join(", ")}</span>
            </div>
          ))}
        </div>
        <div className="flex-2">
          <CategoryStatsRadarChart datasets={datasets} />
          {!!team && (
            <div key={team.id} className="flex flex-row gap-1">
              <StatToggle
                id={team.id}
                title={team.name}
                subtitle="team average"
                isSelected={isTeamSelected}
                onToggle={toggleTeam}
              />
              {users.map(user => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <StatToggle
                    key={user.id}
                    id={user.id}
                    title={user.full_name}
                    subtitle={user.username}
                    isSelected={isSelected}
                    total_answers={user.total_answers}
                    aptitude={userAptitudes[user.id]}
                    onToggle={toggleUser}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default Step4;
