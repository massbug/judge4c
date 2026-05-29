import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { TeacherSidebar } from "@/components/sidebar/teacher-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/sign-in");
  }

  // 获取用户的完整信息（包括角色）
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!fullUser) {
    redirect("/sign-in");
  }

  // 根据用户角色决定显示哪个侧边栏
  const renderSidebar = () => {
    switch (fullUser.role) {
      case "ADMIN":
        return <AdminSidebar user={user} />;
      case "TEACHER":
        return <TeacherSidebar user={user} />;
      case "STUDENT":
      default:
        return <AppSidebar user={user} />;
    }
  };

  return (
    <SidebarProvider>
      {fullUser.role === "STUDENT" ? (
        <AppSidebar user={user} />
      ) : (
        renderSidebar()
      )}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
