"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useProblem } from "@/hooks/use-problem";
import { Clock4Icon, CpuIcon } from "lucide-react";
import { useDockviewStore } from "@/stores/dockview";
import { getStatusColorClass, statusMap } from "@/lib/status";
import type { SubmissionWithTestcaseResult } from "@/types/prisma";
import { EditorLanguageIcons } from "@/config/editor-language-icons";
import { formatDistanceToNow, isBefore, subDays, format } from "date-fns";

interface SubmissionsTableProps {
  submissions: SubmissionWithTestcaseResult[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const { editorLanguageConfigs } = useProblem();
  const { api, setSubmission } = useDockviewStore();

  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRowClick = (submission: SubmissionWithTestcaseResult) => {
    if (!api) return;
    setSubmission(submission);

    const panel = api.getPanel("Details");
    if (panel) {
      panel.api.setActive();
    } else {
      api.addPanel({
        id: "Details",
        component: "Details",
        tabComponent: "Details",
        title: submission.status,
        position: {
          referencePanel: "Submissions",
          direction: "within",
        },
      });
    }
  };

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[100px]">Index</TableHead>
          <TableHead className="w-[170px]">Status</TableHead>
          <TableHead className="w-[100px]">Language</TableHead>
          <TableHead className="w-[100px]">Time</TableHead>
          <TableHead className="w-[100px]">Memory</TableHead>
        </TableRow>
      </TableHeader>

      <tbody aria-hidden="true" className="table-row h-2" />

      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {sortedSubmissions.map((submission, index) => {
          const Icon = EditorLanguageIcons[submission.language];
          const createdAt = new Date(submission.createdAt);
          const submittedDisplay = isBefore(createdAt, subDays(new Date(), 1))
            ? format(createdAt, "yyyy-MM-dd")
            : formatDistanceToNow(createdAt, { addSuffix: true });

          const isEven = (submissions.length - index) % 2 === 0;

          return (
            <TableRow
              key={submission.id}
              onClick={() => handleRowClick(submission)}
              className={cn(
                "border-b-0 hover:text-blue-500 hover:bg-muted hover:cursor-pointer",
                isEven ? "" : "bg-muted/50"
              )}
            >
              <TableCell className="font-medium">
                {sortedSubmissions.length - index}
              </TableCell>
              <TableCell>
                <div className="flex flex-col truncate">
                  <span className={getStatusColorClass(submission.status)}>
                    {statusMap.get(submission.status)?.message}
                  </span>
                  <span className="text-xs">{submittedDisplay}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon size={16} aria-hidden="true" />
                  <span className="truncate text-sm font-semibold mr-2">
                    {
                      editorLanguageConfigs.find(
                        (config) => config.language === submission.language
                      )?.label
                    }
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Clock4Icon size={16} aria-hidden="true" />
                  <span>
                    {submission.executionTime === null
                      ? "N/A"
                      : `${submission.executionTime} ms`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <CpuIcon size={16} aria-hidden="true" />
                  <span>
                    {submission.memoryUsage === null
                      ? "N/A"
                      : `${submission.memoryUsage} MB`}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
