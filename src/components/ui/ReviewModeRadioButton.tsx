import type { FC } from "react";

type Props = {
  reviewMode: "categories" | "topics";
  onChange: (mode: "categories" | "topics") => void;
};

export const ReviewModeRadioButton: FC<Props> = ({ reviewMode, onChange }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className={`${reviewMode === "categories" ? "text-gray-900" : "text-gray-400"}`}>Categories</span>

      <button
        type="button"
        onClick={() => onChange(reviewMode === "categories" ? "topics" : "categories")}
        className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 focus:outline-none transition-colors duration-200"
      >
        <span
          className={`absolute left-1 top-1 inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
            ${reviewMode === "topics" ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>

      <span className={`${reviewMode === "topics" ? "text-gray-900" : "text-gray-400"}`}>Topics</span>
    </div>
  );
};
