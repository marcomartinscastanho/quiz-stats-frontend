import { useMemo, useState } from "react";
import { Header } from "../../components/ui/PageHeader";
import type { CategorizedTopic, CategorizeResponse } from "../../types/api";
import type { Team } from "../../types/user";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";

export const PredictorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [firstHalfInputText, setFirstHalfInputText] = useState("");
  const [secondHalfInputText, setSecondHalfInputText] = useState("");
  const [firstHalfTopics, setFirstHalfTopics] = useState<CategorizedTopic[]>([]);
  const [secondHalfTopics, setSecondHalfTopics] = useState<CategorizedTopic[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleProgressToStep2 = (data: CategorizeResponse) => {
    setFirstHalfTopics(data.first_half_categories);
    setSecondHalfTopics(data.second_half_categories);
    handleNext();
  };

  const toggleUser = (id: number) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]));
  };

  const handleClearUsers = () => setSelectedUserIds([]);

  const selectedUsers = useMemo(() => {
    if (!selectedTeam) {
      return [];
    }

    return selectedTeam.users.filter(u => selectedUserIds.includes(u.id));
  }, [selectedTeam, selectedUserIds]);

  return (
    <div className="space-y-6">
      <Header title="Predictor" />
      {step === 1 && (
        <Step1
          firstHalf={firstHalfInputText}
          secondHalf={secondHalfInputText}
          onChangeFirstHalf={setFirstHalfInputText}
          onChangeSecondHalf={setSecondHalfInputText}
          onNextStep={handleProgressToStep2}
        />
      )}
      {step === 2 && (
        <Step2
          firstHalfTopics={firstHalfTopics}
          secondHalfTopics={secondHalfTopics}
          onChangeFirstHalf={setFirstHalfTopics}
          onChangeSecondHalf={setSecondHalfTopics}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {step === 3 && (
        <Step3
          selectedTeam={selectedTeam}
          selectedUserIds={selectedUserIds}
          onChangeTeam={setSelectedTeam}
          onToggleUser={toggleUser}
          onClearUsers={handleClearUsers}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {step === 4 && (
        <Step4
          firstHalfTopics={firstHalfTopics}
          secondHalfTopics={secondHalfTopics}
          team={selectedTeam}
          users={selectedUsers}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};
export default PredictorPage;
