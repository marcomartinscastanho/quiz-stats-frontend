import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import axios from "../../auth/axios";
import { Button } from "../../components/ui/Button";
import type { Team, User } from "../../types/user";

type Props = {
  selectedTeam: Team | null;
  onChangeTeam: (team: Team | null) => void;
  selectedUserIds: number[];
  onToggleUser: (id: number) => void;
  onClearUsers: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export const Step3: React.FC<Props> = ({
  selectedTeam,
  selectedUserIds,
  onChangeTeam,
  onToggleUser,
  onClearUsers,
  onNext,
  onPrev,
}) => {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await axios.get<Team[]>("/users/me/teams/");
      return res.data;
    },
  });

  const handleTeamChange = (option: { value: number; label: string } | null) => {
    if (!option) return;
    const team = teams?.find(t => t.id === option.value) || null;
    onChangeTeam(team);
    onClearUsers();
  };

  const teamOptions =
    teams?.map(team => ({
      value: team.id,
      label: team.name,
    })) || [];

  const usersToShow = selectedTeam?.users || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Users</h2>
      <div className="mb-4">
        <Select
          value={selectedTeam ? { label: selectedTeam.name, value: selectedTeam.id } : null}
          options={teamOptions}
          onChange={handleTeamChange}
          placeholder="Select a team..."
          isLoading={isLoading}
        />
      </div>

      {selectedTeam && (
        <div className="flex flex-wrap gap-2">
          {usersToShow.map((user: User) => (
            <Button
              key={user.id}
              variant={selectedUserIds.includes(user.id) ? "selected" : "outline"}
              onClick={() => onToggleUser(user.id)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={selectedUserIds.length === 0}>
          Review
        </Button>
      </div>
    </div>
  );
};

export default Step3;
