import { useMemo } from "react";
import { colors } from "../constants";
import type { Team, User } from "../types/user";

export function useChartColors(teams: Team[], users: User[]) {
  const teamColors = useMemo(() => {
    const map: Record<number, string> = {};
    const sortedTeams = [...teams].sort((a, b) => a.id - b.id);
    sortedTeams.forEach((team, i) => {
      map[team.id] = colors.slice().reverse()[i % colors.length];
    });
    return map;
  }, [teams]);

  const userColors = useMemo(() => {
    const map: Record<number, string> = {};
    const sortedUsers = [...users].sort((a, b) => a.id - b.id);
    sortedUsers.forEach((user, i) => {
      map[user.id] = colors[i % colors.length];
    });
    return map;
  }, [users]);

  return { teamColors, userColors };
}
