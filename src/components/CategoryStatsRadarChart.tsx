import type { CategoryStat } from "../types/categories";
import { GenericStatsRadarChart } from "./ui/StatsRadarChart";

export const CategoryStatsRadarChart = ({
  datasets,
}: {
  datasets: { label: string; color: string; data: CategoryStat[] }[];
}) => <GenericStatsRadarChart datasets={datasets} dataKey="category_name" valueKey="xC" />;
