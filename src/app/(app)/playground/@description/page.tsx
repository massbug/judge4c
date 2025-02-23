import MdxPreview from "@/components/mdx-preview";
import { DEFAULT_PROBLEM } from "@/config/problem";

export default function DescriptionPage() {
  return <MdxPreview source={DEFAULT_PROBLEM} />;
}
