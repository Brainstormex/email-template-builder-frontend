import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Palette,
  Settings,
  Save,
  Eye,
  Download,
  Layers,
  Type,
} from "lucide-react";
import Link from "next/link";

const editorItems = [
  {
    label: "Back to Dashboard",
    icon: <ArrowLeft />,
    href: "/",
  },
  {
    label: "Design",
    icon: <Palette />,
    href: "#",
  },
  {
    label: "Elements",
    icon: <Layers />,
    href: "#",
  },
  {
    label: "Typography",
    icon: <Type />,
    href: "#",
  },
  {
    label: "Preview",
    icon: <Eye />,
    href: "#",
  },
  {
    label: "Settings",
    icon: <Settings />,
    href: "#",
  },
  {
    label: "Save",
    icon: <Save />,
    href: "#",
  },
  {
    label: "Export",
    icon: <Download />,
    href: "#",
  },
];

interface SettingsSidebarProps {
  side: "left" | "right";
  isOverlay?: boolean;
}

export function SettingsSidebar({ side, isOverlay = false }: SettingsSidebarProps) {
  return (
    <Sidebar
      variant="floating"
      side={side}
      className={cn(
        "!fixed !inset-y-auto !bottom-0 !h-[calc(100vh-3.5rem)] !z-20",
        // Conditionally apply the top offset ONLY if it's NOT an overlay
        !isOverlay && "!top-14"
      )}    >
      <SidebarHeader className="flex gap-2">
        <Palette />
        <span>Settings</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {editorItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
