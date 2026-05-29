"use client";

import { useEffect } from "react";
import { Actions } from "flexlayout-react";
import { useProblemFlexLayoutStore } from "@/stores/flexlayout";

interface DetailTabSyncProps {
  submissionId: string | undefined;
}

export const DetailTabSync = ({ submissionId }: DetailTabSyncProps) => {
  const { model } = useProblemFlexLayoutStore();

  useEffect(() => {
    if (!model || submissionId) return;

    const detailTab = model.getNodeById("detail");
    if (!detailTab) return;

    model.doAction(Actions.selectTab("submission"));
    model.doAction(Actions.deleteTab("detail"));
  }, [model, submissionId]);

  return null;
};
