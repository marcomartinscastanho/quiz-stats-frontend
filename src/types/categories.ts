export type CategoryGroup = {
  id: number;
  name: string;
};

export type CategoryGroupStat = {
  group_id: number;
  group_name: string;
  xC: number;
  answered?: number;
};
