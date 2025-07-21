import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../auth/axios";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { formatTime } from "../lib/utils";
import type { Quiz } from "../types/quizzes";

export const PlayQuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await axios.get(`/quizzes/${quizId}/unanswered/`);
      return res.data;
    },
    enabled: !!quizId,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

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

  const mutation = useMutation({
    mutationFn: ({ question, is_correct }: { question: number; is_correct: boolean }) =>
      axios.post("/answers/", { question, is_correct }),
    onSuccess: () => {
      setReveal(false);
      setTimeLeft(20);
      setCurrentIndex(prev => prev + 1);
    },
  });

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
                  <div className="text-lg">Answer:</div>
                  <div className="text-4xl mb-2">{currentQuestion.answer}</div>
                  {!!currentQuestion.xp && (
                    <div className="text-sm text-muted-foreground">XP: {currentQuestion.xp}</div>
                  )}
                  <div className="text-xl mb-2">({currentQuestion.categories.join(", ")})</div>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: true })}
                  >
                    I guessed it (be honest)
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => mutation.mutate({ question: currentQuestion.id, is_correct: false })}
                  >
                    I didn't guess it (good)
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
