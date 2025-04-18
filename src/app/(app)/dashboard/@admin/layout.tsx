import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { User } from "@/generated/client";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { type NavUserProps } from "@/components/nav-user";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user: NavUserProps["user"] = (({ name, email, image }) => ({
    name: name ?? "",
    email: email ?? "",
    avatar: image ?? "",
  }))(session.user as User);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Navbar />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
