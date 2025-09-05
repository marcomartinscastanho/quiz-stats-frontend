import { useMutation } from "@tanstack/react-query";
import axios from "../../auth/axios";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import type { CategorizeResponse } from "../../types/api";

type Props = {
  firstHalf: string;
  secondHalf: string;
  onChangeFirstHalf: (t: string) => void;
  onChangeSecondHalf: (t: string) => void;
  onNextStep: (data: CategorizeResponse) => void;
};

export const Step1: React.FC<Props> = ({
  firstHalf,
  secondHalf,
  onChangeFirstHalf,
  onChangeSecondHalf,
  onNextStep,
}) => {
  const categorizeMutation = useMutation({
    mutationFn: (body: { first_half_topics: string[]; second_half_topics: string[] }) =>
      axios.post<CategorizeResponse>("/quizzes/predictor/topics/categorize/", body).then(res => res.data),
    onSuccess: onNextStep,
  });

  const handleCategorize = () => {
    const firstHalfTopics = firstHalf
      .split(/\n|,/)
      .map(t => t.trim())
      .filter(t => t);
    const secondHalfTopics = secondHalf
      .split(/\n|,/)
      .map(t => t.trim())
      .filter(t => t);
    categorizeMutation.mutate({ first_half_topics: firstHalfTopics, second_half_topics: secondHalfTopics });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Topics</h2>
      <div className="flex gap-4">
        <Textarea
          rows={12}
          value={firstHalf}
          onChange={e => onChangeFirstHalf(e.target.value)}
          placeholder="Paste first half topics here"
          className="flex-1"
        />
        <Textarea
          rows={12}
          value={secondHalf}
          onChange={e => onChangeSecondHalf(e.target.value)}
          placeholder="Paste second half topics here"
          className="flex-1"
        />
      </div>
      <Button
        className="mt-4"
        onClick={handleCategorize}
        disabled={categorizeMutation.isPending || !firstHalf.trim() || !secondHalf.trim()}
      >
        {categorizeMutation.isPending ? "Categorizing..." : "Categorize"}
      </Button>
    </div>
  );
};

export default Step1;
