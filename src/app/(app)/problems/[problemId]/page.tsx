import { ProblemView } from "@/features/problems/ui/views/problem-view";

interface PageProps {
  params: Promise<{ problemId: string }>;
  searchParams: Promise<{
    submissionId: string | undefined;
  }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { problemId } = await params;
  const { submissionId } = await searchParams;

  return <ProblemView problemId={problemId} submissionId={submissionId} />;
};

export default Page;
