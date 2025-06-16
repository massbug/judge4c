"use client";

import { useEffect } from "react";
import { CoreEditor } from "@/components/core-editor";
import { useProblemEditorStore } from "@/stores/problem-editor";
import type { LanguageServerConfig, Template } from "@/generated/client";

interface ProblemEditorProps {
  problemId: string;
  templates: Template[];
  languageServerConfigs?: LanguageServerConfig[];
}

export const ProblemEditor = ({
  problemId,
  templates,
  languageServerConfigs,
}: ProblemEditorProps) => {
  const {
    language,
    value,
    path,
    setProblem,
    setValue,
    setEditor,
    setLspWebSocket,
    setMarkers,
  } = useProblemEditorStore();

  useEffect(() => {
    setProblem(problemId, templates);
  }, [problemId, setProblem, templates]);

  return (
    <CoreEditor
      language={language}
      value={value}
      path={path}
      languageServerConfigs={languageServerConfigs}
      onEditorReady={setEditor}
      onLspWebSocketReady={setLspWebSocket}
      onMarkersReady={setMarkers}
      onChange={setValue}
    />
  );
};
