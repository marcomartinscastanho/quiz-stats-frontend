import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card = ({ children, className = "", onClick }: CardProps) => (
  <div
    className={`bg-white rounded-xl shadow p-4 ${className} ${
      onClick ? "cursor-pointer hover:shadow-md transition" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }: CardProps) => <div className={className}>{children}</div>;
