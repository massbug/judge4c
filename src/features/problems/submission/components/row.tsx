"use client";

import { Clock4Icon, CpuIcon } from "lucide-react";
import { formatSubmissionDate } from "@/config/locale";
import { useLocale, useTranslations } from "next-intl";
import { Locale, Submission } from "@/generated/client";
import { Actions, DockLocation } from "flexlayout-react";
import { getColorClassForStatus } from "@/config/status";
import { TableCell, TableRow } from "@/components/ui/table";
import { useProblemFlexLayoutStore } from "@/stores/problem-flexlayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getIconForLanguage, getLabelForLanguage } from "@/config/language";

const formatUsage = (value: number | null, unit: "ms" | "MB") => {
  if (value === null) return "N/A";
  return unit === "MB"
    ? `${(value / 1024 / 1024).toFixed(2)} MB`
    : `${value} ms`;
};

interface SubmissionTableRowProps {
  submission: Submission;
  index: number;
  total: number;
}

export const SubmissionTableRow = ({
  submission,
  index,
  total,
}: SubmissionTableRowProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = useLocale() as Locale;
  const s = useTranslations("StatusMessage");
  const { model } = useProblemFlexLayoutStore();
  const createdAt = new Date(submission.createdAt);
  const Icon = getIconForLanguage(submission.language);
  const label = getLabelForLanguage(submission.language);
  const colorClass = getColorClassForStatus(submission.status);
  const submittedDisplay = formatSubmissionDate(createdAt, locale);

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("submissionId", submission.id.toString());
    router.push(`${pathname}?${params.toString()}`);
    if (!model) return;
    const detailTab = model.getNodeById("detail");
    if (detailTab) {
      model.doAction(Actions.selectTab("detail"));
    } else {
      model.doAction(
        Actions.addNode(
          {
            type: "tab",
            id: "detail",
            name: "Details",
            component: "detail",
          },
          "1",
          DockLocation.CENTER,
          -1
        )
      );
    }
  };

  return (
    <TableRow
      className="border-b-0 hover:text-blue-500 hover:bg-muted hover:cursor-pointer whitespace-nowrap odd:bg-muted/50"
      onClick={handleClick}
    >
      <TableCell className="font-medium">{total - index}</TableCell>
      <TableCell>
        <div className="flex flex-col truncate">
          <span className={colorClass}>{s(submission.status)}</span>
          <span className="text-xs">{submittedDisplay}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Icon size={16} aria-hidden="true" />
          <span className="truncate text-sm font-semibold mr-2">{label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Clock4Icon size={16} aria-hidden="true" />
          <span>{formatUsage(submission.timeUsage, "ms")}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <CpuIcon size={16} aria-hidden="true" />
          <span>{formatUsage(submission.memoryUsage, "MB")}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
