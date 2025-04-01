import { EditorLanguage } from "@/generated/client";
import { COriginal, CplusplusOriginal } from "devicons-react";

// Mapping between EditorLanguage and icons
export const EditorLanguageIcons: Record<
  EditorLanguage,
  React.FunctionComponent<React.SVGProps<SVGElement> & { size?: number | string }>
> = {
  [EditorLanguage.c]: COriginal,
  [EditorLanguage.cpp]: CplusplusOriginal,
};
