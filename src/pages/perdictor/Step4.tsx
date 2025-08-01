import { useEffect, useMemo, useState } from "react";
import axios from "../../auth/axios";
import { CategoryStatsRadarChart } from "../../components/CategoryStatsRadarChart";
import { Button } from "../../components/ui/Button";
import { StatToggle } from "../../components/ui/StatToggle";
import { colors } from "../../constants";
import type { CategoryStat, CategorySummary } from "../../types/categories";
import type { Team, User } from "../../types/user";

export type DataSet = {
  label: string;
  color: string;
  data: CategoryStat[];
};

type Props = {
  team: Team | null;
  users: User[];
  categoryStats: CategorySummary[];
  onPrev: () => void;
};

export const Step4: React.FC<Props> = ({ categoryStats, team, users, onPrev }) => {
  const [isTeamSelected, setIsTeamSelected] = useState<boolean>(!!team);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(users.map(u => u.id));
  const [userStats, setUserStats] = useState<Record<number, CategoryStat[]>>({});
  const [teamStats, setTeamStats] = useState<CategoryStat[]>([]);

  const categoryIds = useMemo(() => categoryStats.map(stat => stat.category.id), [categoryStats]);

  useEffect(() => {
    const fetchUserStats = async () => {
      Promise.all(selectedUserIds.map(userId => axios.get<CategoryStat[]>(`/users/${userId}/stats/categories/`))).then(
        results => {
          const newStats: Record<string, CategoryStat[]> = {};
          selectedUserIds.forEach((id, index) => {
            newStats[id] = results[index].data.filter(stat => categoryIds.includes(stat.category_id));
          });
          setUserStats(newStats);
        }
      );
    };
    if (selectedUserIds.length > 0) {
      fetchUserStats();
    }
  }, [categoryIds, selectedUserIds]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      if (!team) {
        return;
      }
      axios
        .get<CategoryStat[]>(`/teams/${team.id}/stats/categories/`)
        .then(res => setTeamStats(res.data.filter(stat => categoryIds.includes(stat.category_id))));
    };

    fetchTeamStats();
  }, [categoryIds, team]);

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
          {categoryStats.map(({ category, count, topics }) => (
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
