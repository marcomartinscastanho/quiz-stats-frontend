import type { Category } from "./categories";

export type QuizProgress = {
  id: number;
  season: number;
  week: number;
  progress: number;
  correct: number;
};

export type Question = {
  id: number;
  statement: string;
  answer: string;
  xP: number;
  categories: Category[];
};

export type Topic = {
  id: number;
  title: string;
  questions: Question[];
};

export type QuizPart = {
  topics: Topic[];
};

export type Quiz = {
  id: number;
  season: number;
  week: number;
  parts: QuizPart[];
};
