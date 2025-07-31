import { useState } from "react";
import { Header } from "../../components/ui/PageHeader";
import type { CategorizedTopic, CategorizeResponse } from "../../types/api";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";

export const PredictorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [firstHalfTopics, setFirstHalfTopics] = useState<CategorizedTopic[]>([]);
  const [secondHalfTopics, setSecondHalfTopics] = useState<CategorizedTopic[]>([]);

  const handleProgressToStep2 = async (data: CategorizeResponse) => {
    setFirstHalfTopics(data.first_half_categories);
    setSecondHalfTopics(data.second_half_categories);
    setStep(2);
  };

  const handleProgressToStep3 = () => {
    setStep(3);
  };

  const toggleUser = (id: number) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]));
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
          onNext={handleProgressToStep3}
        />
      )}
      {step === 3 && <Step3 selectedUserIds={selectedUserIds} onToggleUser={toggleUser} onNext={() => {}} />}
      {step === 4 && <Step4 />}
    </div>
  );
};
export default PredictorPage;
