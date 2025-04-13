import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Submission } from "@/generated/client";
import { getStatusColorClass } from "@/lib/status";
import { EditorLanguageIcons } from "@/config/editor-language-icons";
import { formatDistanceToNow, isBefore, subDays, format } from "date-fns";
import { useTranslations } from "next-intl";

const t = useTranslations('submissions');
interface SubmissionsTableProps {
  submissions: Submission[]
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[100px]">t('index')</TableHead>
          <TableHead>t('status')</TableHead>
          <TableHead>t('language')</TableHead>
          <TableHead>t('time')</TableHead>
          <TableHead>t('memory')</TableHead>
          <TableHead>t('submitted')</TableHead>
        </TableRow>
      </TableHeader>
      <tbody aria-hidden="true" className="table-row h-2"></tbody>
      <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
        {sortedSubmissions.map((submission, index) => {
          const Icon = EditorLanguageIcons[submission.language];
          const createdAt = new Date(submission.createdAt);
          const submittedDisplay = isBefore(createdAt, subDays(new Date(), 1))
            ? format(createdAt, "yyyy-MM-dd")
            : formatDistanceToNow(createdAt, { addSuffix: true });

          return (
            <TableRow
              key={submission.id}
              className="border-b-0 odd:bg-muted/50 hover:text-blue-500 hover:bg-muted"
            >
              <TableCell className="font-medium">
                {sortedSubmissions.length - index}
              </TableCell>
              <TableCell className={getStatusColorClass(submission.status)}>
                <span>{submission.status}</span>
              </TableCell>
              <TableCell>
                <Icon size={16} aria-hidden="true" />
              </TableCell>
              <TableCell>{submission.executionTime}</TableCell>
              <TableCell>{submission.memoryUsage}</TableCell>
              <TableCell>
                {submittedDisplay}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}
