import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import axios from "../auth/axios";
import { Button } from "../components/ui/button/Button";
import { Card, CardContent } from "../components/ui/Card";
import { estimateReadingTime, formatTime } from "../lib/utils";
import type { CategoryGroup } from "../types/categories";
import type { Quiz } from "../types/quizzes";

export const PlayQuizPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<{ label: string; value: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const { quizId } = useParams<{ quizId: string }>();

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await axios.get(`/quizzes/${quizId}/unanswered/`);
      return res.data;
    },
    enabled: !!quizId,
  });

  const { data: categoryGroups } = useQuery<CategoryGroup[]>({
    queryKey: ["category-groups"],
    queryFn: async () => {
      const res = await axios.get("/quizzes/categories/groups/");
      return res.data;
    },
  });

  const flatQuestions = useMemo(() => {
    if (!quiz) return [];

    return quiz.parts.flatMap(part =>
      part.topics.flatMap(topic =>
        topic.questions.map(q => ({
          ...q,
          topicTitle: topic.title,
        }))
      )
    );
  }, [quiz]);

  const currentQuestion = flatQuestions[currentIndex];

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

  const mutation = useMutation({
    mutationFn: ({ question, is_correct }: { question: number; is_correct: boolean }) =>
      axios.post("/answers/", { question, is_correct }),
    onSuccess: () => {
      setReveal(false);
      setTimeLeft(20);
      setCurrentIndex(prev => prev + 1);
    },
  });

  const updateCategories = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      await axios.patch(`/quizzes/questions/${currentQuestion.id}/categories/update/`, {
        category_ids: categoryIds,
      });
    },
  });

  useEffect(() => {
    if (currentQuestion) {
      setSelectedCategories(
        currentQuestion.categories.map(cat => ({
          label: cat.name,
          value: cat.id,
        }))
      );

      // Set timeLeft = reading time + 20 seconds
      const readingTime = estimateReadingTime(currentQuestion.statement);
      setTimeLeft(Math.floor(readingTime + 20));
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!reveal && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [reveal, timeLeft]);

  if (isLoading || !quiz) return <div className="p-6">Loading...</div>;
  if (!currentQuestion) return <div className="p-6">You finished this quiz!</div>;

  return (
    <div className="flex flex-col flex-1 space-y-6">
      <h1 className="text-2xl md:text-4xl font-bold">
        Season {quiz.season} - Week {quiz.week}
      </h1>

      <Card className="flex flex-col flex-1">
        <CardContent className="flex flex-col flex-1 items-center justify-between p-0 md:p-6 gap-1 md:gap-6">
          <h2 className="md:text-2xl font-semibold">{currentQuestion.topicTitle}</h2>
          <div className="text-2xl md:text-5xl min-h-[200px] flex items-center justify-center text-center">
            {currentQuestion.statement}
          </div>

          {!reveal ? (
            <div className="flex flex-col items-center">
              {!!timeLeft && timeLeft > 0 ? (
                <div className="text-muted-foreground text-sm md:text-base font-bold text-red-700 mb-1">
                  {formatTime(timeLeft)}
                </div>
              ) : (
                <div className="text-muted-foreground text-md md:text-xl font-bold text-red-700 mb-1">Time's up!</div>
              )}
              <Button className="p-8 md:p-10 text-xl md:text-3xl" onClick={() => setReveal(true)}>
                Show Answer
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <label className="text-sm">Answer</label>
                <div className="text-center text-3xl md:text-4xl">{currentQuestion.answer}</div>
                {!!currentQuestion.xP && <div className="text-sm text-muted-foreground">XP: {currentQuestion.xP}</div>}
              </div>
              <div className="flex flex-col w-full items-center">
                <label className="text-sm mb-1">Categories</label>
                <div className="w-full md:w-1/2">
                  <Select
                    isMulti
                    value={selectedCategories}
                    onChange={selected => {
                      const selectedValues = selected.map(option => option.value);
                      setSelectedCategories(selected as { label: string; value: number }[]);
                      updateCategories.mutate(selectedValues);
                    }}
                    options={groupedCategoryOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPlacement="auto"
                  />
                </div>
              </div>

              <div className="flex gap-2 md:gap-4 w-full md:w-1/2">
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-lg md:text-3xl px-2 py-8 md:py-10"
                  onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: false })}
                >
                  Didn't know...
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-lg md:text-3xl px-2 py-8 md:py-10"
                  onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: true })}
                >
                  I Knew It!
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayQuizPage;
