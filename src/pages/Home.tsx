import { useEffect, useState } from "react";
import axios from "../auth/axios";
import { useAuth } from "../auth/useAuth";
import { GroupStatsRadarChart } from "../components/GroupStatsRadarChart";
import { Header } from "../components/ui/PageHeader";
import type { CategoryGroupStat } from "../types/categories";

export function Home() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<CategoryGroupStat[]>([]);

  useEffect(() => {
    if (user) {
      axios.get(`/users/${user.id}/stats/category-groups/`).then(res => setUserStats(res.data));
    }
  }, [user]);

  const datasets = [
    {
      label: user?.username || "",
      color: "#8884d8",
      data: userStats,
    },
  ];

  return (
    <div>
      <Header title="Home Page" />
      <p>Welcome back, {user?.first_name}!</p>
      <GroupStatsRadarChart datasets={datasets} />
    </div>
  );
}

export default Home;
