import { EditorLanguage } from "@/generated/client";
import { getLanguageServerConfig } from "@/actions/language-server";
import { LanguageServerAccordion } from "@/app/(app)/dashboard/@admin/settings/language-server/accordion";

export default async function SettingsLanguageServerPage() {
  const languages = Object.values(EditorLanguage);

  const configPromises = languages.map(async (language) => ({
    language,
    config: await getLanguageServerConfig(language),
  }));

  const configs = await Promise.all(configPromises);

  return <LanguageServerAccordion configs={configs} />;
}
