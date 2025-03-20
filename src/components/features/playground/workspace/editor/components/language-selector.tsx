"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/loading";
import { useProblemEditor } from "@/hooks/use-problem-editor";
import { EditorLanguageIcons } from "@/config/editor-language-icons";

export function LanguageSelector() {
  const { hydrated, currentLang, changeLang, editorLanguageConfigs } = useProblemEditor();

  if (!hydrated) {
    return <Loading className="h-6 w-16 p-0" skeletonClassName="rounded-2xl" />
  }

  return (
    <Select value={currentLang} onValueChange={changeLang}>
      <SelectTrigger className="h-6 px-1.5 py-0.5 border-none shadow-none focus:ring-0 hover:bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
        {editorLanguageConfigs.map((config) => {
          const Icon = EditorLanguageIcons[config.language];
          return (
            <SelectItem key={config.language} value={config.language}>
              <Icon size={16} aria-hidden="true" />
              <span className="truncate text-sm font-semibold mr-2">
                {config.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
