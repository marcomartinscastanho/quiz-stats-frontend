import { clsx } from "clsx";
import React from "react";

type CardVariant = "default" | "disabled";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: CardVariant;
};

export const Card = ({ children, className = "", onClick, variant = "default" }: CardProps) => {
  const isDisabled = variant === "disabled";

  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow p-4 transition",
        {
          "cursor-pointer hover:shadow-md": !isDisabled,
          "opacity-75 cursor-not-allowed": isDisabled,
        },
        className
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }: CardProps) => <div className={className}>{children}</div>;
