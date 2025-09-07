import { useMemo, type FC } from "react";
import { useCategoryGroups } from "../lib/useCategoryGroups";
import { useChartColors } from "../lib/useChartColours";
import type { CategoryGroupStat } from "../types/categories";
import type { Team, User } from "../types/user";
import { GenericStatsRadarChart } from "./ui/StatsRadarChart";

type Props = {
  teams: Team[];
  users: User[];
  selectedTeamIds: number[];
  selectedUserIds: number[];
  teamsStats: Record<number, CategoryGroupStat[]>;
  usersStats: Record<number, CategoryGroupStat[]>;
  onGroupClick: (id: number) => void;
};

export const GroupStatsRadarChart: FC<Props> = ({
  teams,
  users,
  selectedTeamIds,
  selectedUserIds,
  teamsStats,
  usersStats,
  onGroupClick,
}) => {
  const { categoryGroups } = useCategoryGroups();
  const { teamColors, userColors } = useChartColors(teams, users);

  const datasets = useMemo(() => {
    const data: { label: string; color: string; data: CategoryGroupStat[] }[] = [];

    const selectedTeams = teams.filter(t => selectedTeamIds.includes(t.id));
    selectedTeams.forEach(team => {
      data.push({
        label: team.name,
        color: teamColors[team.id],
        data: teamsStats[team.id] || [],
      });
    });

    const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));
    selectedUsers.forEach(user => {
      data.push({
        label: user.username,
        color: userColors[user.id],
        data: usersStats[user.id] || [],
      });
    });

    return data;
  }, [teams, users, selectedTeamIds, teamColors, teamsStats, selectedUserIds, userColors, usersStats]);

  return (
    <GenericStatsRadarChart
      datasets={datasets}
      dataKey="group_name"
      valueKey="xC"
      onLabelClick={tick => onGroupClick(categoryGroups[tick.index].id)}
    />
  );
};
