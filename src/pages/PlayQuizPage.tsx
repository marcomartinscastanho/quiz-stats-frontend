import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import axios from "../auth/axios";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { formatTime } from "../lib/utils";
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Season {quiz.season} - Week {quiz.week}
      </h1>

      <Card>
        <CardContent className="space-y-10 p-6">
          <h2 className="text-xl font-semibold">{currentQuestion.topicTitle}</h2>

          <div className="text-5xl min-h-[200px] flex items-center justify-center text-center">
            {currentQuestion.statement}
          </div>

          <div className="flex flex-col items-center justify-center">
            {!reveal ? (
              <>
                <div className="text-muted-foreground text-sm">{formatTime(timeLeft)}</div>
                <Button onClick={() => setReveal(true)}>Reveal the answer</Button>
              </>
            ) : (
              <>
                <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                  <div className="">Answer:</div>
                  <div className="text-4xl mb-2">{currentQuestion.answer}</div>
                  {!!currentQuestion.xp && (
                    <div className="text-sm text-muted-foreground">XP: {currentQuestion.xp}</div>
                  )}
                </div>
                <label className="block mb-1">Categories:</label>
                <div className="w-1/2 mb-10">
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
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    className="bg-red-600 hover:bg-red-700 p-8"
                    onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: false })}
                  >
                    I didn't guess it
                    <br />
                    (no problem)
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 p-8"
                    onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: true })}
                  >
                    I guessed it
                    <br />
                    (be honest)
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayQuizPage;
