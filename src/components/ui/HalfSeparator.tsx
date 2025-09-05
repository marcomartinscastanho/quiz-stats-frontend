import type { FC } from "react";

type Props = {
  label: string;
};
export const HalfSeparator: FC<Props> = ({ label }) => {
  return (
    <h3 className="flex items-center text-center font-bold my-2">
      <span className="flex-grow border-t border-gray-300"></span>
      <span className="mx-2">{label}</span>
      <span className="flex-grow border-t border-gray-300"></span>
    </h3>
  );
};
