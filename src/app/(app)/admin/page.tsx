import { AdminSidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/header";
import { AdminDashboard } from "@/components/admin/dashboard";
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
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <AdminDashboard userCount={userCount} problemCount={problemCount} />
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}