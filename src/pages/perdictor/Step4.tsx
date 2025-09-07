import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import axios from "../../auth/axios";
import { CategoryStatsRadarChart } from "../../components/CategoryStatsRadarChart";
import { Button } from "../../components/ui/button/Button";
import { CategoriesReview } from "../../components/ui/CategoriesReview";
import { ReviewModeRadioButton } from "../../components/ui/ReviewModeRadioButton";
import { SortedTopics } from "../../components/ui/SortedTopics";
import { StatToggle } from "../../components/ui/StatToggle";
import { TopicsReview } from "../../components/ui/TopicsReview";
import { useChartColors } from "../../lib/useChartColours";
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
  const { teamColors, userColors } = useChartColors(team ? [team] : [], users);
  const [isTeamSelected, setIsTeamSelected] = useState<boolean>(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(users.map(u => u.id));
  const [reviewMode, setReviewMode] = useState<"categories" | "topics">("categories");

  const toggleTeam = () => setIsTeamSelected(sel => !sel);
  const toggleUser = (userId: number) => {
    setSelectedUserIds(ids => (ids.includes(userId) ? ids.filter(id => id !== userId) : [...ids, userId]));
  };

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
  const expandedCategoryIds = useMemo(() => flattenCategories(categorySummaries), [categorySummaries]);
  const userIds = useMemo(() => users.map(u => u.id), [users]);

  const userStatsQueries = useQueries({
    queries: selectedUserIds.map(userId => ({
      queryKey: ["userStats", userId, categoryIds],
      queryFn: () =>
        axios
          .get<CategoryStat[]>(`/users/${userId}/stats/categories/`)
          .then(res =>
            res.data.filter(stat => categoryIds.includes(stat.category_id)).sort(sortCategoryStats(categorySummaries))
          ),
      enabled: selectedUserIds.length > 0,
      staleTime: 15 * 60 * 1000, // 15 min cache
    })),
  });

  const teamStatsQuery = useQuery({
    queryKey: ["teamStats", team?.id, categoryIds],
    queryFn: () =>
      axios
        .get<CategoryStat[]>(`/teams/${team!.id}/stats/categories/`)
        .then(res =>
          res.data.filter(stat => categoryIds.includes(stat.category_id)).sort(sortCategoryStats(categorySummaries))
        ),
    enabled: !!team,
    staleTime: 15 * 60 * 1000, // 15 min cache
  });

  const userAptitudesQuery = useQuery({
    queryKey: ["userAptitudes", userIds, expandedCategoryIds],
    queryFn: () =>
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
        ),
    enabled: userIds.length > 0 && expandedCategoryIds.length > 0,
  });

  const usersStats = useMemo(
    () => Object.fromEntries(selectedUserIds.map((id, index) => [id, userStatsQueries[index]?.data || []])),
    [selectedUserIds, userStatsQueries]
  );

  const userAptitudes = userAptitudesQuery.data || {};

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-2">
          <h2 className="text-xl font-semibold mb-4">Review</h2>
          <ReviewModeRadioButton reviewMode={reviewMode} onChange={setReviewMode} />
          {reviewMode === "categories" ? (
            <CategoriesReview categories={categorySummaries} />
          ) : (
            <TopicsReview firstHalfTopics={firstHalfTopics} secondHalfTopics={secondHalfTopics} />
          )}
        </div>
        <div className="flex-5">
          <CategoryStatsRadarChart
            team={team}
            users={users}
            selectedUserIds={selectedUserIds}
            isTeamSelected={isTeamSelected}
            teamStats={teamStatsQuery.data || []}
            usersStats={usersStats}
          />
          {!!team && (
            <div key={team.id} className="flex flex-row gap-1">
              <StatToggle
                id={team.id}
                title={team.name}
                subtitle="team average"
                isSelected={isTeamSelected}
                selectedBgColor={teamColors[team.id]}
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
                    selectedBgColor={userColors[user.id]}
                    onToggle={toggleUser}
                  />
                );
              })}
            </div>
          )}
          <SortedTopics users={users} firstHalfTopics={firstHalfTopics} secondHalfTopics={secondHalfTopics} />
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
