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
import { Difficulty } from "@prisma/client";

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "text-green-500";
    case "MEDIUM":
      return "text-yellow-500";
    case "HARD":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default async function ProblemsetPage() {
  const problems = await prisma.problem.findMany({
    where: { published: true },
  });

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">Id</TableHead>
          <TableHead className="w-1/3">Title</TableHead>
          <TableHead className="w-1/3">Difficulty</TableHead>
        </TableRow>
      </TableHeader>
      <tbody aria-hidden="true" className="table-row h-2"></tbody>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {problems.map((problem) => (
          <TableRow
            key={problem.id}
            className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
          >
            <TableCell className="py-2.5">
              <Link
                href={`/problems/${problem.id}`}
                className="hover:text-blue-500"
              >
                {problem.id}
              </Link>
            </TableCell>
            <TableCell className="py-2.5">
              <Link
                href={`/problems/${problem.id}`}
                className="hover:text-blue-500"
              >
                {problem.title}
              </Link>
            </TableCell>
            <TableCell
              className={`py-2.5 ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
