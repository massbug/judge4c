import { ProblemEditor } from "@/components/problem-editor";

export default function CodePage() {
  return (
    <div className="relative flex-1">
      <div className="absolute w-full h-full">
        <ProblemEditor />
      </div>
    </div>
  );
}
