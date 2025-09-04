import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CategoryStat, CategorySummary } from "../types/categories";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};

export function estimateReadingTime(sentence: string): number {
  if (!sentence || sentence.trim().length === 0) return 0;

  const words = sentence.trim().split(/\s+/);
  const baseWPM = 200; // proficient non-native reading speed
  const baseSecondsPerWord = 60 / baseWPM;

  let totalTime = 0;

  for (const word of words) {
    const extraFactor = word.length > 6 ? 1 + (word.length - 6) * 0.1 : 1;
    totalTime += baseSecondsPerWord * extraFactor;
  }

  return parseFloat(totalTime.toFixed(2));
}

export function flattenCategories(summaries: CategorySummary[]): number[] {
  return summaries.flatMap(summary => Array(summary.count).fill(summary.category.id));
}

export const sortCategoryStats = (categoryStats: CategorySummary[]) => {
  return (a: CategoryStat, b: CategoryStat) =>
    (categoryStats.find(cs => cs.category.id == b.category_id)?.count || 0) -
    (categoryStats.find(cs => cs.category.id == a.category_id)?.count || 0);
};
