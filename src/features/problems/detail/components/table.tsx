import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Locale } from "@/generated/client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatSubmissionDate } from "@/config/locale";
import { getLabelForLanguage } from "@/config/language";
import { getColorClassForStatus } from "@/config/status";
import { PreDetail } from "@/components/content/pre-detail";
import { ViewSolutionButton } from "./view-solution-button";
import { getLocale, getTranslations } from "next-intl/server";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { MdxComponents } from "@/components/content/mdx-components";
import { DetailForm } from "@/features/problems/detail/components/form";
import { AnalyzeButton } from "@/features/problems/detail/components/analyze-button";

interface DetailTableProps {
  submissionId: string;
}

export const DetailTable = async ({ submissionId }: DetailTableProps) => {
  const t = await getTranslations("DetailsPage");
  const s = await getTranslations("StatusMessage");
  const locale = (await getLocale()) as Locale;
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
  });

  if (!submission)
    return (
      <div className="h-full flex items-center justify-center">
        No Submission
      </div>
    );

  const createdAt = new Date(submission.createdAt);
  const submittedDisplay = formatSubmissionDate(createdAt, locale);

  return (
    <div className="flex flex-col mx-auto max-w-[700px] gap-4 px-4 py-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-start gap-1 overflow-hidden">
            <h3
              className={cn(
                "flex items-center text-xl font-semibold",
                getColorClassForStatus(submission.status)
              )}
            >
              <span>{s(submission.status)}</span>
            </h3>
            <div className="flex max-w-full flex-1 items-center gap-1 overflow-hidden text-xs">
              <span className="whitespace-nowrap mr-1">{t("Time")}</span>
              <span className="max-w-full truncate">{submittedDisplay}</span>
            </div>
          </div>
          <ViewSolutionButton />
        </div>
        <div className="flex flex-col gap-4">
          {submission.message && (
            <MdxRenderer
              source={`\`\`\`shell\n${submission.message}\n\`\`\``}
            />
          )}
          <DetailForm submissionId={submissionId} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>{t("Code")}</Label>
            <Separator
              orientation="vertical"
              className="h-4 bg-muted-foreground"
            />
            <Label>{getLabelForLanguage(submission.language)}</Label>
          </div>
          <div className="flex items-center gap-2">
            <AnalyzeButton value={submission.content} />
          </div>
        </div>
        <MdxRenderer
          source={`\`\`\`${submission.language}\n${submission.content}\n\`\`\``}
          components={{
            ...MdxComponents,
            pre: PreDetail,
          }}
        />
      </div>
    </div>
  );
};
