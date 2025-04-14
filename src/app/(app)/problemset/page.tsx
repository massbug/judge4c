import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CircleCheckBigIcon } from "lucide-react";
import { getDifficultyColorClass } from "@/lib/utils";

export default async function ProblemsetPage() {
  const problems = await prisma.problem.findMany({
    where: { published: true },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      title: true,
      difficulty: true,
    },
  });

  const session = await auth();

  let completedProblems: string[] = [];
  if (session?.user) {
    const submissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        status: "AC",
      },
      select: {
        problemId: true,
      },
    });

    completedProblems = submissions.map(sub => sub.problemId);
  }

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">Status</TableHead>
          <TableHead className="w-1/3">Title</TableHead>
          <TableHead className="w-1/3">Difficulty</TableHead>
        </TableRow>
      </TableHeader>
      <tbody aria-hidden="true" className="table-row h-2"></tbody>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {problems.map((problem, index) => (
          <TableRow
            key={problem.id}
            className="h-10 border-b-0 odd:bg-muted/50 hover:text-blue-500 hover:bg-muted"
          >
            <TableCell className="py-2.5">
              {session?.user && completedProblems.includes(problem.id) && (
                <CircleCheckBigIcon
                  className="text-green-500"
                  size={16}
                  aria-hidden="true"
                />
              )}
            </TableCell>
            <TableCell className="py-2.5">
              <Link
                href={`/problems/${problem.id}`}
                className="hover:text-blue-500"
              >
                {index + 1}. {problem.title}
              </Link>
            </TableCell>
            <TableCell className={`py-2.5 ${getDifficultyColorClass(problem.difficulty)}`}>
              {problem.difficulty}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
