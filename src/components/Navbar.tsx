import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Eye, Save, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export function Navbar() {

    //map all the icons to the buttons
    const icons = [
        {
            icon: Undo2,
            tooltip: "Undo"
        },
        {
            icon: History,
            tooltip: "History",
        },
        {
            icon: Redo2,
            tooltip: "Redo"
        },
        {
            icon: Eye,
            tooltip: "Preview",
            word: "Preview"
        },
    ]
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center justify-between w-full">
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              {icons.map((icon) => (
                <Tooltip key={icon.tooltip}>
                  <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <icon.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{icon.tooltip}</p>
                        </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          <div className="ml-auto">
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
          </div>
            </div>
      </div>
    </nav>
  );
}
