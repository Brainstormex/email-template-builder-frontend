import { SidebarProvider } from "@/components/ui/sidebar";
import EditorNavbar from "@/components/EditorNavbar";
import { DraggableSidebarContainer } from "@/components/Sidebar/DraggableSidebarContainer";
import { EmailTemplateProvider } from "@/contexts/EmailTemplateContext";

export default function CreateTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmailTemplateProvider>
      <div className="flex flex-col h-screen">
        <EditorNavbar />
        <SidebarProvider>
          <DraggableSidebarContainer>
            {children}
          </DraggableSidebarContainer>
        </SidebarProvider>
      </div>
    </EmailTemplateProvider>
  );
}
