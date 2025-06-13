import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { SubmissionTableRow } from "@/features/problems/submission/components/row";

interface SubmissionTableProps {
  problemId: string;
}

export const SubmissionTable = async ({ problemId }: SubmissionTableProps) => {
  const t = await getTranslations("SubmissionsTable");

  const submissions = await prisma.submission.findMany({
    where: { problemId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent whitespace-nowrap">
          <TableHead className="w-[100px]">{t("Index")}</TableHead>
          <TableHead className="w-[170px]">{t("Status")}</TableHead>
          <TableHead className="w-[100px]">{t("Language")}</TableHead>
          <TableHead className="w-[100px]">{t("Time")}</TableHead>
          <TableHead className="w-[100px]">{t("Memory")}</TableHead>
        </TableRow>
      </TableHeader>

      <tbody aria-hidden="true" className="table-row h-2" />

      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {submissions.map((submission, index) => (
          <SubmissionTableRow
            key={submission.id}
            submission={submission}
            index={index}
            total={submissions.length}
          />
        ))}
      </TableBody>
    </Table>
  );
};
