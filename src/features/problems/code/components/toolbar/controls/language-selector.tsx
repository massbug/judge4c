"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/generated/client";
import { LANGUAGES } from "@/config/language";
import COriginal from "devicons-react/icons/COriginal";
import { useProblemEditorStore } from "@/stores/problem-editor";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";

const getIconForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return <COriginal size={16} aria-hidden="true" />;
    case Language.cpp:
      return <CplusplusOriginal size={16} aria-hidden="true" />;
  }
};

const getLabelForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return "C";
    case Language.cpp:
      return "C++";
  }
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useProblemEditorStore();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="h-6 px-1.5 py-0.5 border-none shadow-none focus:ring-0 hover:bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
        {LANGUAGES.map((language) => (
          <SelectItem key={language} value={language}>
            {getIconForLanguage(language)}
            <span className="truncate text-sm font-semibold mr-2">
              {getLabelForLanguage(language)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
