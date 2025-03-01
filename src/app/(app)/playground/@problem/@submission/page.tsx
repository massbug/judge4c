"use client";

import { useMemo } from 'react';
import MdxPreview from "@/components/mdx-preview";
import { useCodeEditorState } from "@/store/useCodeEditor";

export default function ProblemSubmissionPage() {
  const { result } = useCodeEditorState();

  const template = useMemo(() => {
    return `\`\`\`bash\n${result || ""}\`\`\``;
  }, [result]);

  return <MdxPreview source={template} />;
}
