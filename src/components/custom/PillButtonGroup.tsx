"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillButtonItem {
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}

interface PillButtonGroupProps {
  buttons: PillButtonItem[];
  className?: string;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
}

export function PillButtonGroup({
  buttons,
  className,
  activeIndex = -1,
  onActiveChange,
}: PillButtonGroupProps) {
  const [active, setActive] = React.useState(activeIndex);

  React.useEffect(() => {
    setActive(activeIndex);
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActive(index);
    if (onActiveChange) {
      onActiveChange(index);
    }
    if (buttons[index].onClick) {
      buttons[index].onClick?.();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center bg-gray-100 rounded-full p-1 max-w-fit",
        className
      )}
    >
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button
            key={index}
            className={cn(
              "p-3 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center",
              active === index ? "bg-white shadow-sm" : "hover:bg-gray-200",
              button.disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !button.disabled && handleClick(index)}
            disabled={button.disabled}
            title={button.tooltip}
            type="button"
          >
            <Icon className="h-5 w-5 text-gray-500" />
          </button>
        );
      })}
    </div>
  );
} 