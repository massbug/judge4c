"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loading } from "@/components/loading";
import { useAdminSettingsStore } from "@/stores/useAdminSettingsStore";
import { EditorLanguage, LanguageServerConfig } from "@/generated/client";
import { SettingsLanguageServerForm } from "@/app/(app)/dashboard/@admin/settings/language-server/form";

interface LanguageServerAccordionProps {
  configs: {
    language: EditorLanguage;
    config: LanguageServerConfig | null;
  }[];
}

export function LanguageServerAccordion({
  configs,
}: LanguageServerAccordionProps) {
  const { hydrated, activeLanguageServerSetting, setActiveLanguageServerSetting } =
    useAdminSettingsStore();

  if (!hydrated) {
    return (
      <div className="h-full w-full space-y-2">
        <Loading className="h-12 p-0" skeletonClassName="rounded-md" />
        <Loading className="h-12 p-0" skeletonClassName="rounded-md" />
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2"
      value={activeLanguageServerSetting}
      onValueChange={setActiveLanguageServerSetting}
    >
      {configs.map(({ language, config }) => (
        <AccordionItem
          key={language}
          value={language}
          className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border outline-none last:border-b has-focus-visible:ring-[3px]"
        >
          <AccordionTrigger className="px-4 py-3 justify-start gap-3 text-[15px] leading-6 hover:no-underline focus-visible:ring-0 [&>svg]:-order-1">
            {language.toUpperCase()}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-0">
            <div className="px-4 py-3">
              <SettingsLanguageServerForm
                defaultValues={
                  config
                    ? {
                      protocol: config.protocol,
                      hostname: config.hostname,
                      port: config.port,
                      path: config.path,
                    }
                    : {
                      port: null,
                      path: null,
                    }
                }
                language={language}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
