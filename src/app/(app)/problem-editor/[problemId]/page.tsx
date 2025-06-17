"use client";

import { ProblemFlexLayout } from '@/features/problems/components/problem-flexlayout';
import EditDescriptionPanel from '@/components/creater/edit-description-panel';
import EditSolutionPanel from '@/components/creater/edit-solution-panel';
import EditTestcasePanel from '@/components/creater/edit-testcase-panel';
import EditDetailPanel from '@/components/creater/edit-detail-panel';
import EditCodePanel from '@/components/creater/edit-code-panel';
import { updateProblem } from '@/app/actions/updateProblem';

interface ProblemEditorPageProps {
  params: Promise<{ problemId: string }>;
}

interface UpdateData {
  content: string;
  language?: 'c' | 'cpp';
  inputs?: Array<{ index: number; name: string; value: string }>;
}

const handleUpdate = async (
  updateFn: (data: UpdateData) => Promise<{ success: boolean }>,
  data: UpdateData
) => {
  try {
    const result = await updateFn(data);
    if (!result.success) {
      // 这里可以添加更具体的错误处理
    }
    return result;
  } catch (error) {
    console.error('更新失败:', error);
    return { success: false };
  }
};

export default async function ProblemEditorPage({
  params,
}: ProblemEditorPageProps) {
  const { problemId } = await params;

  const components: Record<string, React.ReactNode> = {
    description: <EditDescriptionPanel 
      problemId={problemId} 
      onUpdate={async (data) => {
        await handleUpdate(
          (descriptionData) => updateProblem({
            problemId,
            displayId: 0,
            description: descriptionData.content
          }),
          data
        );
      }} 
    />,
    solution: <EditSolutionPanel 
      problemId={problemId} 
      onUpdate={async (data) => {
        await handleUpdate(
          (solutionData) => updateProblem({
            problemId,
            displayId: 0,
            solution: solutionData.content
          }),
          data
        );
      }} 
    />,
    detail: <EditDetailPanel 
      problemId={problemId} 
      onUpdate={async (data) => {
        await handleUpdate(
          (detailData) => updateProblem({
            problemId,
            displayId: 0,
            detail: detailData.content
          }),
          data
        );
      }} 
    />,
    code: <EditCodePanel 
      problemId={problemId} 
      onUpdate={async (data) => {
        await handleUpdate(
          (codeData) => updateProblem({
            problemId,
            displayId: 0,
            templates: [{
              language: codeData.language || 'c', // 添加默认值
              content: codeData.content
            }]
          }),
          data
        );
      }} 
    />,
    testcase: <EditTestcasePanel 
      problemId={problemId} 
      onUpdate={async (data) => {
        await handleUpdate(
          (testcaseData) => updateProblem({
            problemId,
            displayId: 0,
            testcases: [{
              expectedOutput: testcaseData.content,
              inputs: testcaseData.inputs || [] // 添加默认空数组
            }]
          }),
          data
        );
      }} 
    />
  };

  return (
    <div className="relative flex h-full w-full">
      <ProblemFlexLayout components={components} />
    </div>
  );
}