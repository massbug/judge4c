import { Suspense } from "react";
import {
  BotContent,
  BotContentSkeleton,
} from "@/features/problems/bot/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface BotPanelProps {
  problemId: string;
}

export const BotPanel = ({ problemId }: BotPanelProps) => {
  return (
    <PanelLayout isScroll={false}>
      <Suspense fallback={<BotContentSkeleton />}>
        <BotContent problemId={problemId} />
      </Suspense>
    </PanelLayout>
  );
};
