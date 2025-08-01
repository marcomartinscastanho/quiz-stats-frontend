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

type Dataset<T> = {
  label: string;
  color: string;
  data: T[];
};

type Props<T> = {
  datasets: Dataset<T>[];
  dataKey: keyof T;
  valueKey: keyof T;
  height?: string;
};

export function GenericStatsRadarChart<T extends Record<string, string | number>>({
  datasets,
  dataKey,
  valueKey,
  height = "h-[250px] sm:h-[600px]",
}: Props<T>) {
  const labels = Array.from(new Set(datasets.flatMap(ds => ds.data.map(item => item[dataKey]))));

  const mergedData = labels.map(labelValue => {
    const row: Record<string, string | number> = { [dataKey]: labelValue };
    datasets.forEach(ds => {
      const match = ds.data.find(item => item[dataKey] === labelValue);
      row[ds.label] = match?.[valueKey] ?? 0;
    });
    return row;
  });

  return (
    <div className={`w-full ${height}`}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mergedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey={String(dataKey)} />
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
}
