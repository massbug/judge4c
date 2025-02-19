import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/mode-toggle";

const CodeEditor = dynamic(() => import("@/components/code-editor"), {
  loading: () => <Skeleton className="h-full w-full" />,
});

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
