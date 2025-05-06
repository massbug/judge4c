import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { JudgeCodeButton } from "@/features/problems/components/judge-code-button";
import { NavigateBackButton } from "@/features/problems/components/navigate-back-button";

interface ProblemHeaderProps {
  className?: string;
}

const ProblemHeader = ({ className }: ProblemHeaderProps) => {
  return (
    <header
      className={cn("relative flex h-12 flex-none items-center", className)}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <NavigateBackButton href="/problemset" />
        </div>
        <div className="flex items-center">
          <Suspense fallback={<UserAvatarSkeleton />}>
            <UserAvatar />
          </Suspense>
        </div>
      </div>
      <div className="absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center">
        <JudgeCodeButton />
      </div>
    </header>
  );
};

export { ProblemHeader };
