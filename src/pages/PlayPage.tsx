import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../auth/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/Accordion";
import { Card, CardContent } from "../components/ui/Card";
import { Header } from "../components/ui/PageHeader";
import { Progress } from "../components/ui/Progress";
import type { QuizProgress } from "../types/quizzes";

export const PlayPage = () => {
  const navigate = useNavigate();

  const { data: quizzes = [] } = useQuery<QuizProgress[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await axios.get("/quizzes/progress/");
      return res.data;
    },
  });

  const groupedBySeason = useMemo(() => {
    const grouped: Record<number, QuizProgress[]> = {};
    quizzes.forEach(quiz => {
      if (!grouped[quiz.season]) grouped[quiz.season] = [];
      grouped[quiz.season].push(quiz);
    });
    return grouped;
  }, [quizzes]);

  const defaultSeason = useMemo(() => {
    for (const [season, quizzes] of Object.entries(groupedBySeason)) {
      const isComplete = quizzes.every(q => q.progress >= 100);
      if (!isComplete) return season;
    }
    return Object.keys(groupedBySeason)[0];
  }, [groupedBySeason]);

  const handleClick = (quizId: number) => {
    navigate(`/play/${quizId}/`);
  };

  // const handleRandomClick = () => {
  //   navigate("/play/random/");
  // };

  return (
    <div className="space-y-6">
      <Header title="Play Quizzes" />
      <Accordion type="single" defaultValue={defaultSeason} className="w-full">
        {Object.entries(groupedBySeason).map(([season, quizzes]) => {
          const completed = quizzes.filter(q => q.progress >= 100).length;
          const total = quizzes.length;

          return (
            <AccordionItem key={season} value={season}>
              <AccordionTrigger>
                Season {season} ({completed}/{total})
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes
                  .sort((a, b) => a.week - b.week)
                  .map(quiz => {
                    const isComplete = quiz.progress >= 100.0;
                    return (
                      <Card
                        key={quiz.id}
                        variant={isComplete ? "disabled" : "default"}
                        onClick={() => {
                          if (!isComplete) handleClick(quiz.id);
                        }}
                      >
                        <CardContent className="space-y-2">
                          <small className="text-sm text-muted-foreground">Season {quiz.season}</small>
                          <h3 className="text-xl font-semibold">Week {quiz.week}</h3>
                          <div className="relative">
                            <Progress value={quiz.progress} />
                            <Progress
                              width={`${quiz.progress}%`}
                              value={quiz.correct}
                              backgroundColor="bg-red-600"
                              progressColor="bg-green-600"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer" onClick={handleRandomClick}>
          <CardContent className="p-0 md:p-2">
            <div className="text-xl font-semibold">Random</div>
            <p className="text-muted-foreground mt-1">Play random topics</p>
            <p>🚧 not done yet</p>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default PlayPage;
