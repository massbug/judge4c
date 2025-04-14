"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { useDockviewStore } from "@/stores/dockview";
import { Separator } from "@/components/ui/separator";
import { getStatusColorClass, statusMap } from "@/lib/status";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDistanceToNow, isBefore, subDays, format } from "date-fns";

export default function DetailsPage() {
  const { api, submission } = useDockviewStore();
  const { editorLanguageConfigs, problemId } = useProblem();

  useEffect(() => {
    if (!api || !problemId || !submission?.id) return;
    if (problemId !== submission.problemId) {
      const detailsPanel = api.getPanel("Details");
      if (detailsPanel) {
        api.removePanel(detailsPanel);
      }
    }
  }, [api, problemId, submission])

  if (!api || !problemId || !submission?.id) return null;

  const createdAt = new Date(submission.createdAt);
  const submittedDisplay = isBefore(createdAt, subDays(new Date(), 1))
    ? format(createdAt, "yyyy-MM-dd")
    : formatDistanceToNow(createdAt, { addSuffix: true });

  const source = `\`\`\`${submission?.language}\n${submission?.code}\n\`\`\``;

  const handleClick = () => {
    if (!api) return;
    const submissionsPanel = api.getPanel("Submissions");
    submissionsPanel?.api.setActive();
    const detailsPanel = api.getPanel("Details");
    if (detailsPanel) {
      api.removePanel(detailsPanel);
    }
  }

  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background">
      <div className="h-8 flex flex-none items-center px-2 py-1 border-b">
        <Button
          onClick={handleClick}
          variant="ghost"
          className="h-8 w-auto p-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon size={16} aria-hidden="true" />
          <span>All Submissions</span>
        </Button>
      </div>
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <ScrollArea className="h-full">
            <div className="flex flex-col mx-auto max-w-[700px] gap-4 px-4 py-3">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-1 flex-col items-start gap-1 overflow-hidden">
                    <h3
                      className={cn(
                        "flex items-center text-xl font-semibold",
                        getStatusColorClass(submission.status)
                      )}
                    >
                      <span>
                        {statusMap.get(submission.status)?.message}
                      </span>
                    </h3>
                    <div className="flex max-w-full flex-1 items-center gap-1 overflow-hidden text-xs">
                      <span className="whitespace-nowrap">Submitted on</span>
                      <span className="max-w-full truncate">
                        {submittedDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center pb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Code</span>
                    <Separator
                      orientation="vertical"
                      className="h-4 bg-muted-foreground"
                    />
                    <span>
                      {
                        editorLanguageConfigs.find(
                          (config) => config.language === submission.language
                        )?.label
                      }
                    </span>
                  </div>
                </div>
                <MdxPreview source={source} />
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
