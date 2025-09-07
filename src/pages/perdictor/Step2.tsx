import { useMemo } from "react";
import { Button } from "../../components/ui/button/Button";
import { TopicsCategories } from "../../components/ui/TopicsCategories";
import { useCategoryGroups } from "../../lib/useCategoryGroups";
import type { CategorizedTopic } from "../../types/api";

type Props = {
  firstHalfTopics: CategorizedTopic[];
  secondHalfTopics: CategorizedTopic[];
  onChangeFirstHalf: (values: CategorizedTopic[]) => void;
  onChangeSecondHalf: (values: CategorizedTopic[]) => void;
  onNext: () => void;
  onPrev: () => void;
};

export const Step2: React.FC<Props> = ({
  firstHalfTopics,
  secondHalfTopics,
  onChangeFirstHalf,
  onChangeSecondHalf,
  onNext,
  onPrev,
}) => {
  const { categoryGroups } = useCategoryGroups();

  const groupedCategoryOptions = useMemo(() => {
    if (!categoryGroups) return [];

    return categoryGroups.map(group => ({
      label: group.name,
      options: group.categories.map(cat => ({
        label: cat.name,
        value: cat.id,
      })),
    }));
  }, [categoryGroups]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categorize Topics</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <TopicsCategories
          title="First Half"
          topics={firstHalfTopics}
          options={groupedCategoryOptions}
          onChange={onChangeFirstHalf}
        />
        <TopicsCategories
          title="Second Half"
          topics={secondHalfTopics}
          options={groupedCategoryOptions}
          onChange={onChangeSecondHalf}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>Select Users</Button>
      </div>
    </div>
  );
};

export default Step2;
