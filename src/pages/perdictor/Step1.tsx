import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "../../auth/axios";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import type { CategorizeResponse } from "../../types/api";

type Props = {
  onNextStep: (data: CategorizeResponse) => void;
};

export const Step1: React.FC<Props> = ({ onNextStep }) => {
  const [firstHalfText, setFirstHalfText] = useState("");
  const [secondHalfText, setSecondHalfText] = useState("");

  const categorizeMutation = useMutation({
    mutationFn: (body: { first_half_topics: string[]; second_half_topics: string[] }) =>
      axios.post<CategorizeResponse>("/quizzes/predictor/topics/categorize/", body).then(res => res.data),
    onSuccess: onNextStep,
  });

  const handleCategorize = () => {
    const firstHalfTopics = firstHalfText
      .split(/\n|,/)
      .map(t => t.trim())
      .filter(t => t);
    const secondHalfTopics = secondHalfText
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
          value={firstHalfText}
          onChange={e => setFirstHalfText(e.target.value)}
          placeholder="Paste first half topics here"
          className="flex-1"
        />
        <Textarea
          rows={12}
          value={secondHalfText}
          onChange={e => setSecondHalfText(e.target.value)}
          placeholder="Paste second half topics here"
          className="flex-1"
        />
      </div>
      <Button className="mt-4" onClick={handleCategorize} disabled={!firstHalfText.trim() && !secondHalfText.trim()}>
        Categorize
      </Button>
    </div>
  );
};

export default Step1;
