import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/header";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/*<Header />*/}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}