import { useQuery } from "@tanstack/react-query";
import axios from "../../auth/axios";
import { Button } from "../../components/ui/Button";
import type { User } from "../../types/user";

type Props = {
  selectedUserIds: number[];
  onToggleUser: (id: number) => void;
  onNext: () => void;
};

export const Step3: React.FC<Props> = ({ selectedUserIds, onToggleUser, onNext }) => {
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<User[]>("/users/"); // FIXME: should be only users in this team
      return res.data;
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Users</h2>
      <div className="flex flex-wrap gap-2">
        {users?.map((user: User) => (
          <Button
            key={user.id}
            variant={selectedUserIds.includes(user.id) ? "selected" : "outline"}
            onClick={() => onToggleUser(user.id)}
          >
            {user.username}
          </Button>
        ))}
      </div>
      <Button className="mt-4" onClick={onNext} disabled={!selectedUserIds}>
        Predict
      </Button>
    </div>
  );
};

export default Step3;
