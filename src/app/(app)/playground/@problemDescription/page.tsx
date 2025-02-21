import MdxPreview from "@/components/mdx-preview";
import { DEFAULT_PROBLEM } from "@/config/problem";

export default function ProblemDescriptionPage() {
  return <MdxPreview source={DEFAULT_PROBLEM} />;
}
