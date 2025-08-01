import { useEffect, useState } from "react";
import axios from "../../auth/axios";
import { Header } from "../../components/ui/PageHeader";
import type { CategorizedTopic, CategorizeResponse } from "../../types/api";
import type { CategoryStat } from "../../types/categories";
import type { Team } from "../../types/user";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step5 } from "./Step5";

export const PredictorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [firstHalfInputText, setFirstHalfInputText] = useState("");
  const [secondHalfInputText, setSecondHalfInputText] = useState("");
  const [firstHalfTopics, setFirstHalfTopics] = useState<CategorizedTopic[]>([]);
  const [secondHalfTopics, setSecondHalfTopics] = useState<CategorizedTopic[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [userStats, setUserStats] = useState<Record<number, CategoryStat[]>>({});

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleProgressToStep2 = (data: CategorizeResponse) => {
    setFirstHalfTopics(data.first_half_categories);
    setSecondHalfTopics(data.second_half_categories);
    handleNext();
  };

  const handleProgressToStep5 = () => {
    console.log("selectedUserIds", selectedUserIds);
    console.log(
      "firstHalfTopics",
      firstHalfTopics.flatMap(t => t.categories).map(c => c.id)
    );
    console.log(
      "secondHalfTopics",
      secondHalfTopics.flatMap(t => t.categories).map(c => c.id)
    );
  };

  const toggleUser = (id: number) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]));
  };

  const handleClearUsers = () => setSelectedUserIds([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      Promise.all(selectedUserIds.map(userId => axios.get<CategoryStat[]>(`/users/${userId}/stats/categories/`))).then(
        results => {
          const newStats: Record<string, CategoryStat[]> = {};
          selectedUserIds.forEach((id, index) => {
            const selectedCategoryIds = [
              ...firstHalfTopics.flatMap(t => t.categories),
              ...secondHalfTopics.flatMap(t => t.categories),
            ].map(c => c.id);
            newStats[id] = results[index].data.filter(stat => selectedCategoryIds.includes(stat.category_id));
          });
          setUserStats(newStats);
        }
      );
    };
    if (selectedUserIds.length > 0) {
      fetchUserStats();
    }
  }, [firstHalfTopics, secondHalfTopics, selectedTeam, selectedUserIds]);

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
          users={selectedTeam ? selectedTeam.users.filter(u => selectedUserIds.includes(u.id)) : []}
          userStats={userStats}
          onNext={handleProgressToStep5}
          onPrev={handlePrev}
        />
      )}
      {step === 5 && <Step5 />}
    </div>
  );
};
export default PredictorPage;
