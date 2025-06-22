"use client";

import { useEffect } from "react";
import { CoreEditor } from "@/components/core-editor";
import { CoreDiffEditor } from "@/components/core-diff-editor";
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
    optimizedCode,
    path,
    setProblem,
    setValue,
    setEditor,
    setDiffEditor,
    setLspWebSocket,
    setMarkers,
    showDiffView,
  } = useProblemEditorStore();

  useEffect(() => {
    setProblem(problemId, templates);
  }, [problemId, setProblem, templates]);

  if (!optimizedCode) {
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
  }

  return showDiffView ? (
    <CoreDiffEditor
      language={language}
      original={value}
      modified={optimizedCode}
      onEditorReady={setDiffEditor}
    />
  ) : (
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
