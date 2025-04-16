import { ProblemEditor } from "@/components/problem-editor";

export default function CodePage() {
  return (
    <div className="relative flex-1 border-x border-muted">
      <div className="absolute w-full h-full">
        <ProblemEditor />
      </div>
    </div>
  );
}
