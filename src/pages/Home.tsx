import { useEffect, useState } from "react";
import axios from "../auth/axios";
import { useAuth } from "../auth/useAuth";
import { GroupStatsRadarChart } from "../components/GroupStatsRadarChart";
import type { CategoryGroupStat } from "../types/categories";

export function Home() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<CategoryGroupStat[]>([]);

  useEffect(() => {
    axios.get("/users/me/stats/groups/").then(res => setUserStats(res.data));
  }, []);

  const datasets = [
    {
      label: user?.username || "",
      color: "#8884d8",
      data: userStats,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p>Welcome back, {user?.first_name}!</p>
      <GroupStatsRadarChart datasets={datasets} />
    </div>
  );
}

export default Home;
