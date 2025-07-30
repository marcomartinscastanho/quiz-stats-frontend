import Select, { type MultiValue } from "react-select";
import type { CategorizedTopic } from "../../types/api";
import type { GroupedOption, Option } from "../../types/common";

type Props = {
  title: string;
  topics: CategorizedTopic[];
  options: GroupedOption[];
  onChange: (values: CategorizedTopic[]) => void;
};

export const TopicsCategories: React.FC<Props> = ({ title, topics, options, onChange }) => {
  const updateFirstHalfCategories = (topicIndex: number, selected: Option[]) => {
    const newCategories = selected.map(s => ({ id: s.value, name: s.label }));
    const updated = [...topics];
    updated[topicIndex] = { ...updated[topicIndex], categories: newCategories };
    onChange(updated);
  };

  return (
    <div className="flex-1 flex flex-col gap-1">
      <h3 className="font-semibold mb-2">{title}</h3>
      {topics.map((topic, idx) => (
        <div key={topic.topic} className="flex flex-col gap-1 md:flex-row md:gap-4 md:items-center">
          <label className="block font-medium">{topic.topic}</label>
          <Select
            isMulti
            options={options}
            value={topic.categories.map(c => ({ value: c.id, label: c.name }))}
            onChange={(selected: MultiValue<Option>) => updateFirstHalfCategories(idx, [...(selected || [])])}
            className="react-select-container flex-1"
            classNamePrefix="react-select"
            menuPlacement="auto"
          />
        </div>
      ))}
    </div>
  );
};

export default TopicsCategories;
