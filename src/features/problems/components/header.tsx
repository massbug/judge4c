import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import { JudgeButton } from "@/features/problems/components/judge-button";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { ViewBotButton } from "@/features/problems/bot/components/view-bot-button";

interface ProblemHeaderProps {
  className?: string;
}

export const ProblemHeader = ({ className }: ProblemHeaderProps) => {
  return (
    <header
      className={cn("relative flex h-12 flex-none items-center", className)}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <BackButton href="/problemset" />
        </div>
        <div className="flex items-center gap-4">
          <ViewBotButton />
          <Suspense fallback={<UserAvatarSkeleton />}>
            <UserAvatar />
          </Suspense>
        </div>
      </div>
      <div className="absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center">
        <JudgeButton />
      </div>
    </header>
  );
};
