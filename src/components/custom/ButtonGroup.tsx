"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ButtonItem {
  icon: LucideIcon;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

interface ButtonGroupProps {
  buttons: ButtonItem[];
  orientation?: "horizontal" | "vertical";
  size?: "default" | "sm" | "lg" | "icon";
  spacing?: "default" | "tight" | "loose";
  className?: string;
  showLabels?: boolean;
}

export function ButtonGroup({
  buttons,
  orientation = "horizontal",
  size = "icon",
  spacing = "default",
  className,
  showLabels = false,
}: ButtonGroupProps) {
  // Define spacing classes based on orientation and spacing prop
  const getSpacingClass = () => {
    if (orientation === "horizontal") {
      switch (spacing) {
        case "tight":
          return "space-x-1";
        case "loose":
          return "space-x-4";
        default:
          return "space-x-2";
      }
    } else {
      switch (spacing) {
        case "tight":
          return "space-y-1";
        case "loose":
          return "space-y-4";
        default:
          return "space-y-2";
      }
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          getSpacingClass(),
          className
        )}
      >
        {buttons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={button.variant || "ghost"}
                size={size}
                onClick={button.onClick}
                disabled={button.disabled}
                className={button.className}
              >
                {React.createElement(button.icon, { className: "h-5 w-5" })}
                {showLabels && button.tooltip && (
                  <span className="ml-2">{button.tooltip}</span>
                )}
              </Button>
            </TooltipTrigger>
            {!showLabels && button.tooltip && (
              <TooltipContent>
                <p>{button.tooltip}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
