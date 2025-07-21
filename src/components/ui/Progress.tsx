interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export const Progress = ({ value, className }: ProgressProps) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const isComplete = numericValue >= 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mb-4 ${className}`}>
      <div
        className={`bg-blue-600 h-1.5 rounded-full  ${isComplete ? "bg-green-600" : "bg-yellow-500"}`}
        style={{ width: `${Math.min(numericValue, 100)}%` }}
      />
    </div>
  );
};
