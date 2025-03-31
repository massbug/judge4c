import prisma from "@/lib/prisma";
import { ProblemsetTable } from "@/components/features/dashboard/admin/problemset/table";

export default async function AdminDashboardProblemsetPage() {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      displayId: true,
      title: true,
      difficulty: true,
    },
  });

  return (
    <div className="h-full px-4">
      <ProblemsetTable data={problems} />
    </div>
  );
}
