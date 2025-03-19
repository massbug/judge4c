"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { editor } from "monaco-editor";
import { Loading } from "@/components/loading";
import type { BeforeMount, OnChange, OnMount } from "@monaco-editor/react";

// Dynamically import Monaco Editor with SSR disabled
const Editor = dynamic(
  async () => {
    await import("vscode");
    const monaco = await import("monaco-editor");
    const { loader } = await import("@monaco-editor/react");
    loader.config({ monaco });
    return (await import("@monaco-editor/react")).Editor;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

interface CoreEditorProps {
  language?: string;
  theme?: string;
  path?: string;
  value?: string;
  beforeMount?: BeforeMount;
  onMount?: OnMount;
  onChange?: OnChange;
  options?: editor.IStandaloneEditorConstructionOptions;
  loading?: ReactNode;
  className?: string;
}

export function CoreEditor({
  language,
  theme,
  path,
  value,
  beforeMount,
  onMount,
  onChange,
  options,
  loading,
  className,
}: CoreEditorProps) {
  return (
    <Editor
      language={language}
      theme={theme}
      path={path}
      value={value}
      beforeMount={beforeMount}
      onMount={onMount}
      onChange={onChange}
      options={options}
      loading={loading}
      className={cn("h-full w-full py-2", className)}
    />
  );
}
