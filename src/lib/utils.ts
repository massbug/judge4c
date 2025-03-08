import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { EditorLanguage } from "@prisma/client";
import LanguageServerConfig from "@/config/language-server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPath(lang: EditorLanguage): string {
  const config = LanguageServerConfig[lang];
  return `file:///${config.lang.fileName}${config.lang.fileExtension}`;
}
