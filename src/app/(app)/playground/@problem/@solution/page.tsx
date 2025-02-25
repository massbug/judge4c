import MdxPreview from "@/components/mdx-preview";
import { DEFAULT_PROBLEM_SOLUTION } from "@/config/problem/solution";

export default function ProblemSolutionPage() {
  return <MdxPreview source={DEFAULT_PROBLEM_SOLUTION} />;
}
