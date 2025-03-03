"use client";

import { useMemo } from 'react';
import MdxPreview from "@/components/mdx-preview";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export default function ProblemSubmissionPage() {
  const { result } = useCodeEditorStore();
  const { exitCode, output, executionTime, memoryUsage } = result || {};

  const template = useMemo(() => {
    return `
    ${exitCode || ""}
    \`\`\`bash
    ${output || ""}
    \`\`\`
    ${executionTime || ""}
    ${memoryUsage || ""}
    `;
  }, [exitCode, output, executionTime, memoryUsage]);

  return <MdxPreview source={template} />;
}
