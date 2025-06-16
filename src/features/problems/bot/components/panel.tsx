import { Suspense } from "react";
import {
  BotContent,
  BotContentSkeleton,
} from "@/features/problems/bot/components/content";

interface BotPanelProps {
  problemId: string;
}

export const BotPanel = ({ problemId }: BotPanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <Suspense fallback={<BotContentSkeleton />}>
        <BotContent problemId={problemId} />
      </Suspense>
    </div>
  );
};
