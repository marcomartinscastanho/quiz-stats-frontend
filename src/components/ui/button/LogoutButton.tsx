import type { FC } from "react";
import { Button } from "./Button";

type Props = {
  onCLick: () => void;
};

export const LogoutButton: FC<Props> = ({ onCLick }) => {
  return (
    <Button onClick={onCLick} className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
      Logout
    </Button>
  );
};
