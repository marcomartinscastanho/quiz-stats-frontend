interface StatToggleProps {
  id: number;
  title: string;
  subtitle?: string;
  total_answers?: number;
  aptitude?: number;
  isSelected: boolean;
  onToggle: (id: number) => void;
  selectedBgColor?: string; // optional background color when selected
}

export const StatToggle: React.FC<StatToggleProps> = ({
  id,
  title,
  subtitle,
  total_answers,
  aptitude,
  isSelected,
  selectedBgColor = "bg-blue-100", // default
  onToggle,
}) => {
  // 🌸 function to lighten/dim a hex color
  const getPastel = (hex: string, factor = 0.7) => {
    try {
      const c = hex.startsWith("#") ? hex.substring(1) : hex;
      const num = parseInt(c, 16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;
      r = Math.round(r + (255 - r) * factor);
      g = Math.round(g + (255 - g) * factor);
      b = Math.round(b + (255 - b) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    } catch {
      return selectedBgColor; // fallback in case of bad hex
    }
  };
  const bgStyle = isSelected ? { backgroundColor: getPastel(selectedBgColor) } : {};

  return (
    <div
      className={`flex justify-between cursor-pointer border px-2 py-1 md:p-4 rounded shadow transition ${
        isSelected ? "" : "bg-white"
      }`}
      onClick={() => onToggle(id)}
      style={bgStyle}
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
