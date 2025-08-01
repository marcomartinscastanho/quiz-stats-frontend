import React from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CategoryStat } from "../types/categories";

type Props = {
  datasets: {
    label: string;
    color: string;
    data: CategoryStat[];
  }[];
};

export const CategoryStatsRadarChart: React.FC<Props> = ({ datasets }) => {
  const categories = Array.from(new Set(datasets.flatMap(ds => ds.data.map(c => c.category_name))));

  const mergedData = categories.map(category_name => {
    const row: Record<string, string | number> = { category_name };
    datasets.forEach(ds => {
      const match = ds.data.find(c => c.category_name === category_name);
      row[ds.label] = match?.xC ?? 0;
    });
    return row;
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mergedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category_name" />
          <PolarRadiusAxis />
          {datasets.map(ds => (
            <Radar
              key={ds.label}
              name={ds.label}
              dataKey={ds.label}
              stroke={ds.color}
              fill={ds.color}
              fillOpacity={0.3}
            />
          ))}
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryStatsRadarChart;
