interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export const Progress = ({ value, className }: ProgressProps) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700 ${className}`}>
      <div className={`bg-blue-600 h-1.5 rounded-full dark:bg-blue-500`} style={{ width: numericValue }} />
    </div>
  );
};
