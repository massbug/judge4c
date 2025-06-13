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
import { Skeleton } from "@/components/ui/skeleton";
import { getLocale, getTranslations } from "next-intl/server";
import { CircleCheckBigIcon, CircleDotIcon } from "lucide-react";
import { getColorClassForDifficulty } from "@/config/difficulty";
import type { Locale, ProblemLocalization } from "@/generated/client";

const getLocalizedTitle = (
  localizations: ProblemLocalization[],
  locale: Locale
) => {
  if (!localizations || localizations.length === 0) {
    return "Unknown Title";
  }

  const localization = localizations.find(
    (localization) => localization.locale === locale
  );

  return localization?.content ?? localizations[0].content ?? "Unknown Title";
};

export const ProblemsetTable = async () => {
  const locale = await getLocale();
  const t = await getTranslations();
  const session = await auth();
  const userId = session?.user?.id;

  const problems = await prisma.problem.findMany({
    include: {
      localizations: {
        where: {
          type: "TITLE",
        },
      },
    },
  });

  const completedProblems = new Set<string>();
  const attemptedProblems = new Set<string>();

  if (userId) {
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
      },
      select: {
        problemId: true,
        status: true,
      },
    });

    submissions.forEach((submission) => {
      if (submission.status === "AC") {
        completedProblems.add(submission.problemId);
      } else {
        attemptedProblems.add(submission.problemId);
      }
    });

    completedProblems.forEach((problemId) => {
      attemptedProblems.delete(problemId);
    });
  }

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">{t("ProblemsetPage.Status")}</TableHead>
          <TableHead className="w-1/3">{t("ProblemsetPage.Title")}</TableHead>
          <TableHead className="w-1/3">
            {t("ProblemsetPage.Difficulty")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {problems.map((problem, index) => (
          <TableRow
            key={problem.id}
            className="h-10 border-b-0 odd:bg-muted/50 hover:text-blue-500 hover:bg-muted"
          >
            <TableCell className="py-2.5">
              {userId &&
                (completedProblems.has(problem.id) ? (
                  <CircleCheckBigIcon
                    className="text-green-500"
                    size={18}
                    aria-hidden="true"
                  />
                ) : attemptedProblems.has(problem.id) ? (
                  <CircleDotIcon
                    className="text-yellow-500"
                    size={18}
                    aria-hidden="true"
                  />
                ) : null)}
            </TableCell>
            <TableCell className="py-2.5">
              <Link
                href={`/problems/${problem.id}`}
                className="hover:text-blue-500"
              >
                {index + 1}.{" "}
                {getLocalizedTitle(problem.localizations, locale as Locale)}
              </Link>
            </TableCell>
            <TableCell
              className={`py-2.5 ${getColorClassForDifficulty(
                problem.difficulty
              )}`}
            >
              {t(`Difficulty.${problem.difficulty}`)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const ProblemsetTableSkeleton = ({
  skeletonRows = 12,
}: {
  skeletonRows?: number;
}) => {
  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/3">
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead className="w-1/3">
            <Skeleton className="h-4 w-24" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <TableRow key={index} className="h-10 border-b-0 odd:bg-muted/50">
            <TableCell className="py-2.5">
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell className="py-2.5">
              <Skeleton className="h-4 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
