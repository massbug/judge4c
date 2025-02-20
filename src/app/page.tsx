import CodeEditor from "@/components/code-editor";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 flex items-center justify-end px-8 border-b">
        <ModeToggle />
      </header>
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}
