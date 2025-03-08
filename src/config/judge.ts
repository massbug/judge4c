import { EditorLanguage } from "@prisma/client";
import { EditorLanguageConfig } from "./editor-language";
import { DockerMetadata, JudgeMetadata } from "@/types/judge";

export const DockerConfig: Record<EditorLanguage, DockerMetadata> = {
  [EditorLanguage.c]: {
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeLimit: 1000,
    memoryLimit: 128,
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  },
  [EditorLanguage.cpp]: {
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeLimit: 1000,
    memoryLimit: 128,
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  }
}

export const JudgeConfig: Record<EditorLanguage, JudgeMetadata> = {
  [EditorLanguage.c]: {
    editorLanguageMetadata: EditorLanguageConfig[EditorLanguage.c],
    dockerMetadata: DockerConfig[EditorLanguage.c],
  },
  [EditorLanguage.cpp]: {
    editorLanguageMetadata: EditorLanguageConfig[EditorLanguage.cpp],
    dockerMetadata: DockerConfig[EditorLanguage.cpp],
  },
};
