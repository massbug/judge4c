import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

interface ProblemEditLayoutProps {
  children: React.ReactNode;
}

export const ProblemEditLayout = ({ children }: ProblemEditLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="relative flex h-12 flex-none items-center">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            <BackButton href="/problem" />
          </div>
          <div className="flex items-center gap-4">
            <Suspense fallback={<UserAvatarSkeleton />}>
              <UserAvatar />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="flex w-full flex-grow overflow-y-hidden p-2.5 pt-0">
        {children}
      </div>
    </div>
  );
};
