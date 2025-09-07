import { type FC } from "react";
import { useChartColors } from "../lib/useChartColours";
import type { CategoryGroupStat } from "../types/categories";
import type { Team, User } from "../types/user";
import { GenericStatsRadarChart } from "./ui/StatsRadarChart";

type Props = {
  teams: Team[];
  users: User[];
  selectedTeamIds: number[];
  selectedUserIds: number[];
  teamStats: Record<number, CategoryGroupStat[]>;
  userStats: Record<number, CategoryGroupStat[]>;
};

export const GroupStatsRadarChart: FC<Props> = ({
  teams,
  users,
  selectedTeamIds,
  selectedUserIds,
  teamStats,
  userStats,
}) => {
  const { teamColors, userColors } = useChartColors(teams, users);
  const datasets = [
    ...selectedTeamIds.map(id => ({
      label: teams.find(t => t.id === id)?.name || `Team ${id}`,
      color: teamColors[id],
      data: teamStats[id] || [],
    })),
    ...selectedUserIds.map(id => ({
      label: users.find(u => u.id === id)?.username || `User ${id}`,
      color: userColors[id],
      data: userStats[id] || [],
    })),
  ];

  return <GenericStatsRadarChart datasets={datasets} dataKey="group_name" valueKey="xC" />;
};
