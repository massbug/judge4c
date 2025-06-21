import { Difficulty } from "@/generated/client";

export const getColorClassForDifficulty = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return "text-green-500";
    case Difficulty.MEDIUM:
      return "text-yellow-500";
    case Difficulty.HARD:
      return "text-red-500";
  }
};
