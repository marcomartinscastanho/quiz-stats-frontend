import type { FC } from "react";
import type { CategorySummary } from "../../types/categories";

type Props = {
  categories: CategorySummary[];
};

export const CategoriesReview: FC<Props> = ({ categories: categorySummaries }) => {
  return categorySummaries.map(({ category, count, topics }) => (
    <div key={category.id} className="mb-1">
      <h3 className="font-bold">
        {category.name} {count > 1 && `(x${count})`}
      </h3>
      <p className="font-extralight text-sm ml-4">{topics.join(", ")}</p>
    </div>
  ));
};
