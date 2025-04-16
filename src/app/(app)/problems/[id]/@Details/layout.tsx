import { Suspense } from "react";
import { getUserLocale } from "@/i18n/locale";
import { Loading } from "@/components/loading";
import DetailsPage from "@/app/(app)/problems/[id]/@Details/page";

export default async function DetailsLayout() {
  const locale = await getUserLocale();

  return (
    <div className="flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <Suspense fallback={<Loading />}>
        <DetailsPage locale={locale} />;
      </Suspense>
    </div>
  );
}
