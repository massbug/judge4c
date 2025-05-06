import { Suspense } from "react";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

const ProblemsetHeader = () => {
  return (
    <header className="flex h-12 flex-none items-center">
      <div className="container mx-auto flex h-full items-center justify-end px-4">
        <div className="flex items-center">
          <Suspense fallback={<UserAvatarSkeleton />}>
            <UserAvatar />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export { ProblemsetHeader };
