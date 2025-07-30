import type { GroupBase } from "react-select";

export type Option = {
  label: string;
  value: number;
};

export type GroupedOption = GroupBase<Option>;
