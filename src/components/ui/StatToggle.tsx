interface StatToggleProps {
  id: number;
  title: string;
  subtitle?: string;
  total_answers?: number;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

export const StatToggle: React.FC<StatToggleProps> = ({ id, title, subtitle, total_answers, isSelected, onToggle }) => {
  return (
    <div
      key={id}
      className={`flex cursor-pointer border px-2 py-1 md:p-4 rounded shadow transition ${isSelected ? "bg-blue-100" : "bg-white"}`}
      onClick={() => onToggle(id)}
    >
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="font-semibold">{title || subtitle}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {!!total_answers && (
        <div className="text-sm text-gray-600 text-center">
          <p className="font-bold">{total_answers}</p>
          <p>answers</p>
        </div>
      )}
    </div>
  );
};

export default StatToggle;
