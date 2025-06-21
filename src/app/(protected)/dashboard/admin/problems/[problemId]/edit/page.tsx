import { ProblemEditView } from "@/features/admin/ui/views/problem-edit-view";

interface PageProps {
  params: Promise<{ problemId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { problemId } = await params;

  return <ProblemEditView problemId={problemId} />;
};

export default Page;
