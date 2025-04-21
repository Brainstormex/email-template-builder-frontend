"use client";

import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { ButtonGroup, ButtonItem } from "@/components/custom/ButtonGroup";

export function ExampleSidePanel() {
  // Text formatting buttons
  const textFormatButtons: ButtonItem[] = [
    {
      icon: Bold,
      tooltip: "Bold",
      onClick: () => console.log("Bold clicked")
    },
    {
      icon: Italic,
      tooltip: "Italic",
      onClick: () => console.log("Italic clicked")
    }
  ];

  // Alignment buttons
  const alignmentButtons: ButtonItem[] = [
    {
      icon: AlignLeft,
      tooltip: "Align Left",
      onClick: () => console.log("Align left clicked")
    },
    {
      icon: AlignCenter,
      tooltip: "Align Center",
      onClick: () => console.log("Align center clicked")
    },
    {
      icon: AlignRight,
      tooltip: "Align Right",
      onClick: () => console.log("Align right clicked")
    },
    {
      icon: AlignJustify,
      tooltip: "Justify",
      onClick: () => console.log("Justify clicked")
    }
  ];

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Text Formatting</h3>
      
      {/* Horizontal button group */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Text Style</label>
        <ButtonGroup 
          buttons={textFormatButtons} 
          spacing="default"
        />
      </div>
      
      {/* Vertical button group with labels */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Text Alignment</label>
        <ButtonGroup 
          buttons={alignmentButtons}
          orientation="vertical" 
          showLabels={true}
          size="default"
        />
      </div>
      
      {/* Button group with different variants */}
      <div>
        <label className="block text-sm font-medium mb-2">Alignment Options</label>
        <ButtonGroup 
          buttons={alignmentButtons.map((btn, index) => ({
            ...btn,
            variant: index === 0 ? "default" : "outline"
          }))}
          spacing="tight"
        />
      </div>
    </div>
  );
} 