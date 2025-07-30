import { useState } from "react";
import { Header } from "../../components/ui/PageHeader";
import type { CategorizedTopic, CategorizeResponse } from "../../types/api";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

export const PredictorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [firstHalfTopics, setFirstHalfTopics] = useState<CategorizedTopic[]>([]);
  const [secondHalfTopics, setSecondHalfTopics] = useState<CategorizedTopic[]>([]);

  const handleProgressToStep2 = async (data: CategorizeResponse) => {
    setFirstHalfTopics(data.first_half_categories);
    setSecondHalfTopics(data.second_half_categories);
    setStep(2);
  };

  return (
    <div className="space-y-6">
      <Header title="Predictor" />
      {step === 1 && <Step1 onNextStep={handleProgressToStep2} />}
      {step === 2 && (
        <Step2
          firstHalfTopics={firstHalfTopics}
          secondHalfTopics={secondHalfTopics}
          onChangeFirstHalf={setFirstHalfTopics}
          onChangeSecondHalf={setSecondHalfTopics}
        />
      )}
      {step === 3 && <Step3 />}
    </div>
  );
};
export default PredictorPage;
