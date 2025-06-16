import { AdminSidebar } from "@/components/admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <aside className="w-64 border-r">
        <AdminSidebar adminMenuActive={true} />
      </aside>
      
      {/* 主要内容区域 */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
}