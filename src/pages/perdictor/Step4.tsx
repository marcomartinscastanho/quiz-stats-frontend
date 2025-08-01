import { CategoryStatsRadarChart } from "../../components/CategoryStatsRadarChart";
import { Button } from "../../components/ui/Button";
import type { CategoryStat, CategorySummary } from "../../types/categories";

export type DataSet = {
  label: string;
  color: string;
  data: CategoryStat[];
};

type Props = {
  categories: CategorySummary[];
  datasets: DataSet[];
  onNext: () => void;
  onPrev: () => void;
};

export const Step4: React.FC<Props> = ({ categories, datasets, onNext, onPrev }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {categories.map(({ category, count, topics }) => (
            <div key={category.id} className="mb-1">
              <h3 className="font-bold">
                {category.name} {count > 1 && `(x${count})`}
              </h3>
              <span className="font-extralight text-sm ml-4">{topics.join(", ")}</span>
            </div>
          ))}
        </div>
        <div className="flex-2">
          <CategoryStatsRadarChart datasets={datasets} />
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>Predict</Button>
      </div>
    </div>
  );
};

export default Step4;
