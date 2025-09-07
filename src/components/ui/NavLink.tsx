import type { FC } from "react";
import { NavLink as ReactRouterDomNavLink } from "react-router-dom";

type Props = {
  label: string;
  to: string;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center h-full px-4 border-b-2 transition-colors",
    isActive ? "bg-blue-50 border-blue-600 " : "border-transparent hover:bg-blue-50 hover:border-blue-200",
  ].join(" ");

export const NavLink: FC<Props> = ({ label, to }) => {
  return (
    <ReactRouterDomNavLink to={to} className={linkClass}>
      {label}
    </ReactRouterDomNavLink>
  );
};
