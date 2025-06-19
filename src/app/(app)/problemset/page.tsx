import { Suspense } from "react";
import {
  ProblemsetTable,
  ProblemsetTableSkeleton,
} from "@/features/problemset/components/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProblemsetPage() {
  return (
    <div className="flex flex-col h-full">
      {/* 顶部导航栏 - 固定高度 */}
      <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>题库</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 主内容区 - 自适应剩余高度 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 pb-0">
          <h1 className="text-2xl font-bold tracking-tight">题目列表</h1>
          <p className="text-muted-foreground mt-1">
            选择题目开始练习
          </p>
        </div>

        {/* 题目表格 - 占满剩余空间 */}
        <div className="flex-1 p-4 md:p-6 pt-2 overflow-auto">
          <Suspense fallback={<ProblemsetTableSkeleton />}>
            <ProblemsetTable />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
