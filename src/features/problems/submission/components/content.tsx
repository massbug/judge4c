import { auth, signIn } from "@/lib/auth";
import { CodeXmlIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SubmissionTable } from "@/features/problems/submission/components/table";

interface SubmissionContentProps {
  problemId: string;
}

const LoginPromptCard = () => {
  const t = useTranslations("LoginPromptCard");

  return (
    <div className="flex h-full flex-col items-center justify-start gap-2 pt-[10vh]">
      <div className="flex items-center gap-3">
        <CodeXmlIcon
          className="shrink-0 text-blue-500"
          size={16}
          aria-hidden="true"
        />
        <p className="text-base font-medium">{t("title")}</p>
      </div>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <Button
        variant="outline"
        size="sm"
        className="bg-muted hover:bg-muted/80"
        onClick={async () => {
          "use server";
          await signIn();
        }}
      >
        {t("loginButton")}
      </Button>
    </div>
  );
};

export const SubmissionContent = async ({
  problemId,
}: SubmissionContentProps) => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <ScrollArea className="h-full px-3">
      {userId ? <SubmissionTable problemId={problemId} /> : <LoginPromptCard />}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export const SubmissionContentSkeleton = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute h-full w-full p-4 md:p-6">
        {/* Title skeleton */}
        <Skeleton className="mb-6 h-8 w-3/4" />

        {/* Content skeletons */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-5/6" />
        <Skeleton className="mb-4 h-4 w-2/3" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-4/5" />

        {/* Example section heading */}
        <Skeleton className="mb-4 mt-8 h-6 w-1/4" />

        {/* Example content */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-5/6" />

        {/* Code block skeleton */}
        <div className="mb-6">
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* More content */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
      </div>
    </div>
  );
};
