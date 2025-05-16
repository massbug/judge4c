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
        problemId: 'cmapqoqt90001vzcuy84ka6x7',
    };

    return (
        <div className="flex flex-col h-screen mx-auto p-4">
            {/* 测试用例展示区域 - 固定高度1/3 */}
            <div className="mb-6 h-1/3">
                <h2 className="text-xl font-semibold mb-2">测试用例</h2>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    {testInput.code}
                </pre>
            </div>

            {/* DiffEditor容器 - 占据剩余2/3高度 */}
            <div className="flex-grow">
                <AIProblemEditor 
                    initialCode={testInput.code}
                    problemId={testInput.problemId}
                />
            </div>
        </div>
    );
}