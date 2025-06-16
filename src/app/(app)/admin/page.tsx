// import { AdminSidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/header";
import { MonitoringDashboard } from "@/components/admin/monitoring-dashboard";
import AdminLayout from "@/app/(app)/admin/layout";
import type { ReactElement } from "react";
import prisma from "@/lib/prisma";

export default async function AdminPage(): Promise<ReactElement> {
  const [userCount, problemCount] = await Promise.all([
    prisma.user.count(),
    prisma.problem.count(),
  ]);

  return (
    <AdminLayout>
      <div className="h-full">
        <Header />
        <main className="container py-6 h-full">
          {/* 监控仪表盘替代原有仪表盘 */}
          <MonitoringDashboard userCount={userCount} problemCount={problemCount} />
        </main>
      </div>
    </AdminLayout>
  );
}
