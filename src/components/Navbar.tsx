"use client";

import { Save, Undo2, RotateCcw, Redo2, Eye, History } from "lucide-react";
import {
  PillButtonGroup,
  PillButtonItem,
} from "@/components/custom/PillButtonGroup";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navbar() {
  // History buttons group (Undo, History, Redo)
  const buttons: PillButtonItem[] = [
    {
      icon: Undo2,
      tooltip: "Undo",
      onClick: () => console.log("Undo clicked"),
    },
    {
      icon: History,
      tooltip: "History",
      onClick: () => console.log("History clicked"),
    },
    {
      icon: Redo2,
      tooltip: "Redo",
      onClick: () => console.log("Redo clicked"),
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {buttons.map((button) => (
              <TooltipProvider key={button.tooltip}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <button.icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{button.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {/* Save button shifted to the right */}
          <div className="ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Save className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </nav>
  );
}
