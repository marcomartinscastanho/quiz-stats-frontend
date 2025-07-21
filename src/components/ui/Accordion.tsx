import * as React from "react";
import { cn } from "../../lib/utils";

type AccordionContextType = {
  value: string;
  openItems: string[];
  toggleItem: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

export const Accordion = ({
  children,
  type = "single",
  defaultValue = [],
  className,
}: {
  children: React.ReactNode;
  type?: "single" | "multiple";
  defaultValue?: string[];
  className?: string;
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    setOpenItems(prev =>
      type === "single"
        ? prev.includes(value)
          ? []
          : [value]
        : prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
    );
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, value: "" }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  return (
    <AccordionContext.Provider value={{ ...context, value }}>
      <div className={cn("shadow rounded-lg overflow-hidden  hover:shadow-md transition", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within AccordionItem");

  const isOpen = context.openItems.includes(context.value);

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(context.value)}
      className={cn(
        "w-full text-left flex items-center justify-between px-4 py-2 font-medium bg-muted hover:bg-muted/50 transition cursor-pointer",
        isOpen && "bg-muted/50",
        className
      )}
    >
      <h2>{children}</h2>
      <span className={cn("transition-transform", isOpen && "rotate-90")}>▶</span>
    </button>
  );
};

export const AccordionContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within AccordionItem");

  const isOpen = context.openItems.includes(context.value);

  return isOpen ? <div className={cn("p-4", className)}>{children}</div> : null;
};
