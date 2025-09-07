import { useMemo, type FC } from "react";
import { useChartColors } from "../lib/useChartColours";
import type { CategoryStat } from "../types/categories";
import type { Team, User } from "../types/user";
import { GenericStatsRadarChart } from "./ui/StatsRadarChart";

type Props = {
  team: Team | null;
  users: User[];
  selectedUserIds: number[];
  isTeamSelected: boolean;
  teamStats: CategoryStat[];
  usersStats: Record<number, CategoryStat[]>;
};

export const CategoryStatsRadarChart: FC<Props> = ({
  team,
  users,
  selectedUserIds,
  isTeamSelected,
  teamStats,
  usersStats,
}) => {
  const { teamColors, userColors } = useChartColors(team ? [team] : [], users);

  const datasets = useMemo(() => {
    const data: { label: string; color: string; data: CategoryStat[] }[] = [];

    if (team && isTeamSelected) {
      data.push({
        label: team.name,
        color: teamColors[team.id],
        data: teamStats,
      });
    }

    const selectedUsers = team ? team.users.filter(u => selectedUserIds.includes(u.id)) : [];
    selectedUsers.forEach(user => {
      data.push({
        label: user.username,
        color: userColors[user.id],
        data: usersStats[user.id] || [],
      });
    });

    return data;
  }, [team, isTeamSelected, teamColors, teamStats, selectedUserIds, userColors, usersStats]);

  return <GenericStatsRadarChart datasets={datasets} dataKey="category_name" valueKey="xC" />;
};
