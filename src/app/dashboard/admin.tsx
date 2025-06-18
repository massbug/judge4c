import AdminTable from "@/components/user-table/admin-table";

export default function AdminDashboardPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">管理员管理</h2>
      <AdminTable />
    </div>
  );
} 