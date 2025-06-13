import { Complexity } from "@/types/complexity";

export const analyzeComplexity = async (content: string) => {
  console.log("🚀 ~ analyzeComplexity ~ content:", content);
  return { time: Complexity.Enum["O(N)"], space: Complexity.Enum["O(1)"] };
};
