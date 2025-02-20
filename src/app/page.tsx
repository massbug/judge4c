import CodeEditor from "@/components/code-editor";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex items-center justify-end px-4 border-b">
        <ModeToggle />
      </header>
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}
