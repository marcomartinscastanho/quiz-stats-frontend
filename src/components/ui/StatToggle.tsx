interface StatToggleProps {
  id: number;
  title: string;
  subtitle?: string;
  total_answers?: number;
  aptitude?: number;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

export const StatToggle: React.FC<StatToggleProps> = ({
  id,
  title,
  subtitle,
  total_answers,
  aptitude,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      className={`flex justify-between cursor-pointer border px-2 py-1 md:p-4 rounded shadow transition ${isSelected ? "bg-blue-100" : "bg-white"}`}
      onClick={() => onToggle(id)}
    >
      <div className="flex flex-col justify-center">
        <h2 className="font-semibold">{title || subtitle}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className=" flex flex-col justify-center gap-2">
        {!!aptitude && (
          <div className="text-sm text-gray-600 text-center">
            <span>
              <span className="font-bold">{aptitude.toFixed(2)} </span>
              xC
            </span>
          </div>
        )}
        {!!total_answers && (
          <div className="text-xs text-gray-600 text-center">
            <p className="font-bold">{total_answers}</p>
            <p>answers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatToggle;
