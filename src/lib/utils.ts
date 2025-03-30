import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { EditorLanguageConfig, Difficulty } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPath(
  problemId: string,
  editorLanguageConfig: EditorLanguageConfig
) {
  return `file:///${problemId}/${editorLanguageConfig.fileName}${editorLanguageConfig.fileExtension}`;
}

export const getDifficultyColorClass = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "text-green-500";
    case "MEDIUM":
      return "text-yellow-500";
    case "HARD":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
