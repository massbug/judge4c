import CodeEditor from "@/components/code-editor";
import { DEFAULT_PROBLEM } from "@/config/problem";
import MdxPreview from "@/components/problem-description";

export default function HomePage() {
  return (
    <div className="h-full flex items-center">
      <div className="h-full w-1/2">
        <MdxPreview source={DEFAULT_PROBLEM} />
      </div>
      <div className="h-full w-1/2">
        <CodeEditor />
      </div>
    </div>
  );
}
