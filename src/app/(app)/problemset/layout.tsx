import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface ProblemsetLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsetLayout({ children }: ProblemsetLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}