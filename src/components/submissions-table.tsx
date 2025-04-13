import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Submission } from "@/generated/client";
import { getStatusColorClass } from "@/lib/status";
import { Clock4Icon, CpuIcon } from "lucide-react";
import { EditorLanguageIcons } from "@/config/editor-language-icons";
import { formatDistanceToNow, isBefore, subDays, format } from "date-fns";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
              className={cn(
                "border-b-0 hover:text-blue-500 hover:bg-muted",
                isEven ? "" : "bg-muted/50"
              )}
            >
              <TableCell className="font-medium">
                {sortedSubmissions.length - index}
              </TableCell>
              <TableCell>
                <div className="flex flex-col truncate">
                  <span className={getStatusColorClass(submission.status)}>
                    {submission.status}
                  </span>
                  <span className="text-xs">{submittedDisplay}</span>
                </div>
              </TableCell>
              <TableCell>
                <Icon size={16} aria-hidden="true" />
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
