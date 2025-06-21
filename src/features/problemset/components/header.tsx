import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

interface ProblemsetHeaderProps {
  className?: string;
}

export const ProblemsetHeader = ({ className }: ProblemsetHeaderProps) => {
  return (
    <header className={cn("flex h-12 flex-none items-center", className)}>
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <BackButton href="/" />
        </div>
        <div className="flex items-center">
          <Suspense fallback={<UserAvatarSkeleton />}>
            <UserAvatar />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
