"use client";

import { Actions } from "flexlayout-react";
import { BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblemFlexLayoutStore } from "@/stores/problem-flexlayout";

export const ViewSolutionButton = () => {
  const { model } = useProblemFlexLayoutStore();

  const handleClick = () => {
    if (!model) return;
    model.doAction(Actions.selectTab("solution"));
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      <BookOpenIcon />
      查看题解
    </Button>
  );
};
