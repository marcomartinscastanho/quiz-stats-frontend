import { useEffect, useState } from "react";
import axios from "../auth/axios";
import { useAuth } from "../auth/useAuth";
import { GroupStatsRadarChart } from "../components/GroupStatsRadarChart";
import { StatToggle } from "../components/ui/StatToggle";
import { useChartColors } from "../lib/useChartColours";
import type { CategoryGroupStat } from "../types/categories";
import type { Team, User } from "../types/user";

export const TeamPage = () => {
  const { user: me } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { teamColors, userColors } = useChartColors(teams, users);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [teamStats, setTeamStats] = useState<Record<number, CategoryGroupStat[]>>({});
  const [userStats, setUserStats] = useState<Record<number, CategoryGroupStat[]>>({});

  const toggleTeam = async (teamId: number) => {
    const alreadySelected = selectedTeamIds.includes(teamId);
    if (alreadySelected) {
      setSelectedTeamIds(ids => ids.filter(id => id !== teamId));
    } else {
      setSelectedTeamIds(ids => [...ids, teamId]);
      if (!teamStats[teamId]) {
        const res = await axios.get<CategoryGroupStat[]>(`/teams/${teamId}/stats/category-groups/`);
        setTeamStats(stats => ({ ...stats, [teamId]: res.data }));
      }
    }
  };

  const toggleUser = async (userId: number) => {
    const alreadySelected = selectedUserIds.includes(userId);
    if (alreadySelected) {
      setSelectedUserIds(ids => ids.filter(id => id !== userId));
    } else {
      setSelectedUserIds(ids => [...ids, userId]);
      if (!userStats[userId]) {
        const res = await axios.get<CategoryGroupStat[]>(`/users/${userId}/stats/category-groups/`);
        setUserStats(stats => ({ ...stats, [userId]: res.data }));
      }
    }
  };

  useEffect(() => {
    if (!me) return;

    const fetchMyStats = async (id: number) => {
      const res = await axios.get<CategoryGroupStat[]>(`/users/${id}/stats/category-groups/`);
      setUserStats(stats => ({ ...stats, [id]: res.data }));
    };

    if (me) {
      setSelectedUserIds(ids => (ids.includes(me.id) ? ids : [...ids, me.id]));
      fetchMyStats(me.id);
    }
  }, [me]);

  useEffect(() => {
    if (!me) return;

    const fetchUsersAndMyTeams = async () => {
      const [usersRes, myTeamsRes] = await Promise.all([
        axios.get<User[]>("/users/"),
        axios.get<Team[]>("/users/me/teams/"),
      ]);
      setUsers(usersRes.data);
      setTeams(myTeamsRes.data);
    };
    fetchUsersAndMyTeams();
  }, [me]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 flex flex-col gap-1 md:gap-2 divide-y divide-solid divide-gray-300">
        {teams.map(team => {
          const isTeamSelected = selectedTeamIds.includes(team.id);
          return (
            <div key={team.id} className="flex flex-col gap-1 md:gap-2 pb-1 md:pb-2">
              <StatToggle
                id={team.id}
                title={team.name}
                subtitle="team average"
                isSelected={isTeamSelected}
                selectedBgColor={teamColors[team.id]}
                onToggle={toggleTeam}
              />
              {team.users.map(user => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <StatToggle
                    key={user.id}
                    id={user.id}
                    title={user.full_name}
                    subtitle={user.username}
                    isSelected={isSelected}
                    total_answers={user.total_answers}
                    selectedBgColor={userColors[user.id]}
                    onToggle={toggleUser}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <GroupStatsRadarChart
        teams={teams}
        users={users}
        selectedTeamIds={selectedTeamIds}
        selectedUserIds={selectedUserIds}
        teamStats={teamStats}
        userStats={userStats}
      />
    </div>
  );
};
