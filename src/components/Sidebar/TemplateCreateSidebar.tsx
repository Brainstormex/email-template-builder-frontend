import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowLeft, Palette, Settings, Save, Eye, Download, Layers, Type } from "lucide-react";
import Link from "next/link";
import { NavUser } from "../ui/nav-user";

const templateCreateItems = [
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

const data = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://github.com/shadcn.png",
  },
};

export function TemplateCreateSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarHeader className="flex gap-2">
        <Palette />
        <span>Template Builder</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {templateCreateItems.map((item) => (
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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
