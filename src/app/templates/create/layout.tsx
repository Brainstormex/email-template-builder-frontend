import { SidebarProvider } from "@/components/ui/sidebar";
import { EditorNavbar } from "@/components/EditorNavbar";
import { DraggableSidebarContainer } from "@/components/Sidebar/DraggableSidebarContainer";

export default function CreateTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <EditorNavbar />
      <SidebarProvider>
        <DraggableSidebarContainer>
          {children}
        </DraggableSidebarContainer>
      </SidebarProvider>
    </div>
  );
}
