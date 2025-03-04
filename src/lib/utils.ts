import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { EditorLanguage } from "@/types/editor-language";
import languageServerConfigs from "@/config/language-server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPath(lang: EditorLanguage): string {
  const config = languageServerConfigs[lang];
  return `file:///${config.lang.fileName}${config.lang.fileExtension}`;
}
