interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  backgroundColor?: string;
  progressColor?: string;
  completeColor?: string;
  heightClass?: string;
  width?: string;
}

export const Progress = ({
  value,
  className = "",
  showLabel = false,
  backgroundColor = "bg-gray-200",
  progressColor = "bg-yellow-500",
  completeColor = "bg-green-600",
  heightClass = "h-1.5",
  width,
}: ProgressProps) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const isComplete = numericValue >= 100;
  const clampedValue = Math.min(numericValue, 100);

  return (
    <div
      className={`w-full ${backgroundColor} rounded-full my-0.5 ${heightClass} ${className}`}
      style={width ? { width: width } : undefined}
      title={`${numericValue}%`}
    >
      <div
        className={`${isComplete ? completeColor : progressColor} ${heightClass} rounded-full`}
        style={{ width: `${clampedValue}%` }}
      />
      {showLabel && <span className="text-xs text-gray-700 mt-1 block text-right">{Math.round(clampedValue)}%</span>}
    </div>
  );
};
