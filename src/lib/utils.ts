import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { EditorLanguageConfig } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPath(editorLanguageConfig: EditorLanguageConfig) {
  return `file:///${editorLanguageConfig.fileName}${editorLanguageConfig.fileExtension}`;
}
