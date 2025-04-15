import { getUserLocale } from "@/i18n/locale";
import DetailsPage from "@/app/(app)/problems/[id]/@Details/page";

export default async function DetailsLayout() {
  const locale = await getUserLocale();

  return <DetailsPage locale={locale} />;
}
