import { useEffect, useState } from "react";
import axios from "../auth/axios";
import { GroupStatsRadarChart } from "../components/GroupStatsRadarChart";
import { colors } from "../constants";
import type { CategoryGroupStat } from "../types/categories";

type User = {
  id: number;
  username: string;
  full_name: string;
};

export const TeamPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teamStats, setTeamStats] = useState<CategoryGroupStat[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [userStats, setUserStats] = useState<Record<number, CategoryGroupStat[]>>({});

  useEffect(() => {
    const fetchUsersAndTeamStats = async () => {
      const [usersRes, teamStatsRes] = await Promise.all([
        axios.get("/users/"),
        axios.get("/users/team/stats/groups/"),
      ]);
      setUsers(usersRes.data);
      setTeamStats(teamStatsRes.data);
    };
    fetchUsersAndTeamStats();
  }, []);

  const toggleUser = async (userId: number) => {
    const alreadySelected = selectedUserIds.includes(userId);
    if (alreadySelected) {
      setSelectedUserIds(ids => ids.filter(id => id !== userId));
    } else {
      setSelectedUserIds(ids => [...ids, userId]);
      if (!userStats[userId]) {
        const res = await axios.get(`/users/${userId}/stats/groups/`);
        setUserStats(stats => ({ ...stats, [userId]: res.data }));
      }
    }
  };

  const datasets = [
    {
      label: "team",
      color: "#8884d8",
      data: teamStats,
    },
    ...selectedUserIds.map((id, index) => ({
      label: users.find(u => u.id === id)?.username || `User ${id}`,
      color: colors[index % colors.length],
      data: userStats[id] || [],
    })),
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 flex flex-col gap-1 md:gap-2">
        {users.map(user => {
          const isSelected = selectedUserIds.includes(user.id);
          return (
            <div
              key={user.id}
              className={`cursor-pointer border p-2 md:p-4 rounded shadow transition ${isSelected ? "bg-blue-100" : "bg-white"}`}
              onClick={() => toggleUser(user.id)}
            >
              <h2 className="font-semibold">{user.full_name || user.username}</h2>
              <p className="text-sm text-gray-600">{user.username}</p>
            </div>
          );
        })}
      </div>
      <div className="md:w-2/3">
        <GroupStatsRadarChart datasets={datasets} />
      </div>
    </div>
  );
};
