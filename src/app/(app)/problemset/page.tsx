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
import { getTranslations } from "next-intl/server";
import { getDifficultyColorClass } from "@/lib/utils";
import { CircleCheckBigIcon, CircleDotIcon } from "lucide-react";

export default async function ProblemsetPage() {
  const problems = await prisma.problem.findMany({
    where: { published: true },
    orderBy: { id: "asc" },
    select: { id: true, title: true, difficulty: true },
  });

  const session = await auth();
  const userId = session?.user?.id;

  const submissions = userId
    ? await prisma.submission.findMany({
      where: { userId },
      select: { problemId: true, status: true },
    })
    : [];

  const completedProblems = new Set(submissions.filter(s => s.status === "AC").map(s => s.problemId));
  const attemptedProblems = new Set(submissions.filter(s => s.status !== "AC").map(s => s.problemId));

  const t = await getTranslations();

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">{t("ProblemsetPage.Status")}</TableHead>
          <TableHead className="w-1/3">{t("ProblemsetPage.Title")}</TableHead>
          <TableHead className="w-1/3">{t("ProblemsetPage.Difficulty")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {problems.map((problem, index) => (
          <TableRow
            key={problem.id}
            className="h-10 border-b-0 odd:bg-muted/50 hover:text-blue-500 hover:bg-muted"
          >
            <TableCell className="py-2.5">
              {userId && (completedProblems.has(problem.id) ? (
                <CircleCheckBigIcon className="text-green-500" size={18} aria-hidden="true" />
              ) : attemptedProblems.has(problem.id) ? (
                <CircleDotIcon className="text-yellow-500" size={18} aria-hidden="true" />
              ) : null)}
            </TableCell>
            <TableCell className="py-2.5">
              <Link href={`/problems/${problem.id}`} className="hover:text-blue-500" prefetch>
                {index + 1}. {problem.title}
              </Link>
            </TableCell>
            <TableCell className={`py-2.5 ${getDifficultyColorClass(problem.difficulty)}`}>
              {t(`Difficulty.${problem.difficulty}`)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
