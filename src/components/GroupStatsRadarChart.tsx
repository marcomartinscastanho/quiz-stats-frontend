import type { CategoryGroupStat } from "../types/categories";
import { GenericStatsRadarChart } from "./ui/StatsRadarChart";

export const GroupStatsRadarChart = ({
  datasets,
}: {
  datasets: { label: string; color: string; data: CategoryGroupStat[] }[];
}) => <GenericStatsRadarChart datasets={datasets} dataKey="group_name" valueKey="xC" />;
