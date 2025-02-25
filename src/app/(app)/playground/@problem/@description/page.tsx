import MdxPreview from "@/components/mdx-preview";
import { DEFAULT_PROBLEM_DESCRIPTION } from "@/config/problem/description";

export default function ProblemDescriptionPage() {
  return <MdxPreview source={DEFAULT_PROBLEM_DESCRIPTION} />;
}
