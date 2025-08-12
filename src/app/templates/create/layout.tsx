import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { TemplateCreateSidebar } from "@/components/Sidebar/TemplateCreateSidebar";

export default function CreateTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TemplateCreateSidebar />
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        <main className="pt-14">{children}</main>
      </div>
    </SidebarProvider>
  );
}
