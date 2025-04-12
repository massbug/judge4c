import { AddPanelOptions } from "dockview";

export const DefaultDockviewOptions: AddPanelOptions[] = [
  {
    id: "Description",
    component: "Description",
    title: "Description",
    params: { icon: "FileTextIcon" },
  },
  {
    id: "Solutions",
    component: "Solutions",
    title: "Solutions",
    params: { icon: "FlaskConicalIcon" },
    position: {
      referencePanel: "Description",
      direction: "within",
    },
    inactive: true,
  },
  {
    id: "Submissions",
    component: "Submissions",
    title: "Submissions",
    params: { icon: "CircleCheckBigIcon" },
    position: {
      referencePanel: "Solutions",
      direction: "within",
    },
    inactive: true,
  },
  {
    id: "Code",
    component: "Code",
    title: "Code",
    params: { icon: "SquarePenIcon" },
    position: {
      referencePanel: "Submissions",
      direction: "right",
    },
  },
  {
    id: "Bot",
    component: "Bot",
    title: "Bot",
    params: { icon: "BotIcon" },
    position: {
      referencePanel: "Code",
      direction: "right",
    },
  },
  {
    id: "Testcase",
    component: "Testcase",
    title: "Testcase",
    params: { icon: "SquareCheckIcon" },
    position: {
      referencePanel: "Code",
      direction: "below",
    },
  },
  {
    id: "TestResult",
    component: "TestResult",
    title: "Test Result",
    params: { icon: "TerminalIcon" },
    position: {
      referencePanel: "Testcase",
      direction: "within",
    },
    inactive: true,
  },
];
