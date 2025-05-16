import { AIProblemEditor } from "@/components/ai-optimized-editor";
import { useParams } from "next/navigation";

export default function CodePage() {
  const params = useParams();
  const problemId = params.id as string;

  const handleOptimize = async () => {
    // 这里实现调用AI优化逻辑
    console.log("Optimizing code for problem", problemId);
  };

  return (
    <div className="relative flex-1">
      <div className="absolute w-full h-full flex flex-col">
        <div className="p-2 border-b border-border flex justify-between items-center">
          <button 
            onClick={handleOptimize}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Optimize Code
          </button>
        </div>
        <AIProblemEditor 
          problemId={problemId} 
        />
      </div>
    </div>
  );
}