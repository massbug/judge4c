import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Locale, ProblemLocalization } from "@/generated/client";

const getLocalizedDescription = (
  localizations: ProblemLocalization[],
  locale: Locale
) => {
  if (!localizations || localizations.length === 0) {
    return "Unknown Description";
  }

  const localization = localizations.find(
    (localization) => localization.locale === locale
  );

  return (
    localization?.content ?? localizations[0].content ?? "Unknown Description"
  );
};

interface DescriptionContentProps {
  problemId: string;
}

export const DescriptionContent = async ({
  problemId,
}: DescriptionContentProps) => {
  const locale = await getLocale();

  const descriptions = await prisma.problemLocalization.findMany({
    where: {
      problemId,
      type: "DESCRIPTION",
    },
  });

  const description = getLocalizedDescription(descriptions, locale as Locale);

  return (
    <ScrollArea className="h-full">
      <MdxRenderer source={description} className="p-4 md:p-6" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export const DescriptionContentSkeleton = () => {
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
