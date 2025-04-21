"use client";

import { Undo2, RotateCcw, Redo2 } from "lucide-react";
import { PillButtonGroup, PillButtonItem } from "./PillButtonGroup";

export function ActionToolbar() {
  // Undo, History, Redo buttons group
  const historyButtons: PillButtonItem[] = [
    {
      icon: Undo2,
      tooltip: "Undo",
      onClick: () => console.log("Undo clicked")
    },
    {
      icon: RotateCcw,
      tooltip: "History",
      onClick: () => console.log("History clicked")
    },
    {
      icon: Redo2,
      tooltip: "Redo",
      onClick: () => console.log("Redo clicked")
    }
  ];

  return (
    <div className="flex items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <PillButtonGroup 
          buttons={historyButtons} 
          className="bg-background/95"
        />
      </div>
    </div>
  );
} 