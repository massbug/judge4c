import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { EditorLanguageConfig } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPath(
  problemId: string,
  editorLanguageConfig: EditorLanguageConfig
) {
  return `file:///${problemId}/${editorLanguageConfig.fileName}${editorLanguageConfig.fileExtension}`;
}
