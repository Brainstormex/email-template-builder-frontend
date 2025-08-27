import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Palette,
  Layers,
  Square,
  ChevronRight,
  ChevronDown,
  Type,
  Image,
  Link as LinkIcon,
  Table,
  Minus,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useEmailTemplate } from "@/contexts/EmailTemplateContext";
import { defaultEmailBlocks } from "@/lib/email-schema";
import { EmailElement } from "@/lib/email-schema";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Square: <Square className="w-4 h-4" />,
  Table: <Table className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
  Link: <LinkIcon className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
};

interface LayerItemProps {
  item: EmailElement;
  level?: number;
  onSelect?: (elementId: string) => void;
  selectedElementId?: string | null;
}

function LayerItem({ item, level = 0, onSelect, selectedElementId }: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedElementId === item.id;

  const handleClick = () => {
    if (onSelect) {
      onSelect(item.id);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
          level > 0 && "ml-4",
          isSelected && "bg-accent text-accent-foreground"
        )}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={handleExpandClick}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        {iconMap[item.icon] || <Square className="w-4 h-4" />}
        <span className="text-sm font-medium">{item.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children?.map((child: EmailElement) => (
            <LayerItem 
              key={child.id} 
              item={child} 
              level={level + 1} 
              onSelect={onSelect}
              selectedElementId={selectedElementId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface EditorSidebarProps {
  side?: "left" | "right";
  isOverlay?: boolean;
}

export function EditorSidebar({ side = "left", isOverlay = false }: EditorSidebarProps) {
  const { state, addElement, selectElement } = useEmailTemplate();
  const [selectedTab, setSelectedTab] = useState<"layers" | "blocks">("layers");

  const handleElementSelect = (elementId: string) => {
    selectElement(elementId);
  };

  const handleBlockDrag = (blockType: string, blockName: string) => {
    // Add the element to canvas but don't auto-select it
    addElement(blockType as EmailElement['type'], blockName);
    // Don't auto-select - let user click on canvas to select
  };

  const renderEmptyLayers = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Layers className="w-12 h-12 text-muted-foreground/50 mb-3" />
      <h3 className="text-sm font-medium text-muted-foreground mb-1">No elements yet</h3>
      <p className="text-xs text-muted-foreground/70">
        Start building your email by dragging blocks from the Blocks tab
      </p>
    </div>
  );

  const renderLayers = () => {
    if (state.template.elements.length === 0) {
      return renderEmptyLayers();
    }

    return (
      <div className="space-y-1">
        {state.template.elements.map((element) => (
          <LayerItem 
            key={element.id} 
            item={element} 
            onSelect={handleElementSelect}
            selectedElementId={state.selectedElementId}
          />
        ))}
      </div>
    );
  };

  return (
    <Sidebar
      variant="floating"
      side={side}
      className={cn(
        "!fixed !inset-y-auto !bottom-0 !h-[calc(100vh-3.5rem)] !z-20",
        !isOverlay && "!top-14"
      )}
    >
      <SidebarHeader className="flex gap-2">
        <Palette />
        <span>Template Builder</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "layers" | "blocks")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="layers" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="blocks" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Blocks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="layers" className="mt-4 space-y-2">
              <div className="px-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Email Elements</h3>
                  {state.template.elements.length > 0 && (
                    <span className="text-xs text-muted-foreground/70">
                      {state.template.elements.length} element{state.template.elements.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {renderLayers()}
              </div>
            </TabsContent>
            
            <TabsContent value="blocks" className="mt-4">
              <div className="px-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Available Blocks</h3>
                <div className="space-y-2">
                  {defaultEmailBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all group"
                      onClick={() => handleBlockDrag(block.id, block.name)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          {iconMap[block.icon] || <Square className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground">{block.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
                          <span className="inline-block text-xs text-primary/70 bg-primary/10 px-2 py-1 rounded-full mt-2">
                            {block.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
