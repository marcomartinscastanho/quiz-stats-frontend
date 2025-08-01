export type CategoryGroupStat = {
  group_id: number;
  group_name: string;
  xC: number;
  answered?: number;
};

export type CategoryStat = {
  category_id: number;
  catgory_name: string;
  xC: number;
  answered?: number;
};

export type Category = {
  id: number;
  name: string;
};

export type CategoryGroup = {
  id: number;
  name: string;
  categories: Category[];
};
