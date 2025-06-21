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

interface WrongProblem {
  id: string;
  name: string;
  status: string;
  url?: string;
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
      case "GUEST":
      default:
        // 学生（GUEST）需要查询错题数据
        return <AppSidebar user={user} wrongProblems={[]} />;
    }
  };

  // 只有学生才需要查询错题数据
  let wrongProblemsData: WrongProblem[] = [];
  if (fullUser.role === "GUEST") {
    // 查询未完成（未AC）题目的最新一次提交
    const wrongProblems = await prisma.problem.findMany({
      where: {
        submissions: {
          some: { userId: user.id },
        },
        NOT: {
          submissions: {
            some: { userId: user.id, status: "AC" },
          },
        },
      },
      select: {
        id: true,
        displayId: true,
        localizations: {
          where: { locale: "zh", type: "TITLE" },
          select: { content: true },
        },
        submissions: {
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            status: true,
          },
        },
      },
    });

    // 组装传递给 AppSidebar 的数据格式
    wrongProblemsData = wrongProblems.map((p) => ({
      id: p.id,
      name: p.localizations[0]?.content || `题目${p.displayId}`,
      status: p.submissions[0]?.status || "-",
      url: `/problems/${p.id}`,
    }));
  }

  return (
    <SidebarProvider>
      {fullUser.role === "GUEST" ? (
        <AppSidebar user={user} wrongProblems={wrongProblemsData} />
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
