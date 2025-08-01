import { CategoryStatsRadarChart } from "../../components/CategoryStatsRadarChart";
import { Button } from "../../components/ui/Button";
import { colors } from "../../constants";
import type { CategoryStat, CategorySummary } from "../../types/categories";
import type { User } from "../../types/user";

type Props = {
  categories: CategorySummary[];
  users: User[];
  userStats: Record<number, CategoryStat[]>;
  onNext: () => void;
  onPrev: () => void;
};

export const Step4: React.FC<Props> = ({ categories, users, userStats, onNext, onPrev }) => {
  const datasets = [
    ...users.map((user, index) => ({
      label: user.username,
      color: colors[index % colors.length],
      data: userStats[user.id] || [],
    })),
  ];

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
