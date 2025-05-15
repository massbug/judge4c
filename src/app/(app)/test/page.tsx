import { AIProblemEditor } from '@/components/ai-optimized-editor';

export default function TestAiEditorPage() {
    // 静态测试数据
    const testInput = {
        code: `function bubbleSort(arr: number[]) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}`,
        problemId: '1',
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">AI 编辑器测试页</h1>
            
            {/* 测试用例展示 */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">测试用例</h2>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    {testInput.code}
                </pre>
            </div>

            {/* 测试组件 */}
            <AIProblemEditor 
                initialCode={testInput.code}
                problemId={testInput.problemId}
            />
        </div>
    );
}