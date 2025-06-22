import { create } from "zustand";
import type { editor } from "monaco-editor";
import { LANGUAGES } from "@/config/language";
import { Language, type Template } from "@/generated/client";

type Problem = {
  problemId: string;
  templates: Template[];
};

type ProblemEditorState = {
  problem: Problem | null;
  language: Language;
  value: string;
  optimizedCode: string;
  path: string;
  editor: editor.IStandaloneCodeEditor | null;
  diffEditor: editor.IStandaloneDiffEditor | null;
  lspWebSocket: WebSocket | null;
  markers: editor.IMarker[];
  showDiffView: boolean;
};

type ProblemEditorAction = {
  setProblem: (problemId: string, templates: Template[]) => void;
  setLanguage: (language: Language) => void;
  setValue: (value: string) => void;
  setOptimizedCode: (value: string) => void;
  setPath: (path: string) => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setDiffEditor: (diffEditor: editor.IStandaloneDiffEditor) => void;
  setLspWebSocket: (lspWebSocket: WebSocket) => void;
  setMarkers: (markers: editor.IMarker[]) => void;
  toggleView: () => void;
};

type ProblemEditorStore = ProblemEditorState & ProblemEditorAction;

export const useProblemEditorStore = create<ProblemEditorStore>((set, get) => ({
  problem: null,
  language: Language.c,
  value: "",
  optimizedCode: "",
  path: "",
  editor: null,
  diffEditor: null,
  lspWebSocket: null,
  markers: [],
  showDiffView: false,
  setProblem: (problemId, templates) => {
    const language = getLanguage(problemId);
    const value = getValue(problemId, language, templates);
    const path = getPath(problemId, language);
    set({ problem: { problemId, templates }, language, value, path });
  },
  setLanguage: (newLanguage) => {
    const { problem, language, value } = get();
    if (problem) {
      localStorage.setItem(`${problem.problemId}_${language}`, value);
      localStorage.setItem(`${problem.problemId}_language`, newLanguage);
    }
    localStorage.setItem("global_language", newLanguage);
    const newValue = problem
      ? getValue(problem.problemId, newLanguage, problem.templates)
      : "";
    const newPath = problem ? getPath(problem.problemId, newLanguage) : "";
    set({ language: newLanguage, value: newValue, path: newPath });
  },
  setValue: (value) => {
    const { problem, language } = get();
    if (problem) {
      localStorage.setItem(`${problem.problemId}_${language}`, value);
    }
    set({ value });
  },
  setOptimizedCode: (optimizedCode) => set({ optimizedCode }),
  setPath: (path) => set({ path }),
  setEditor: (editor) => set({ editor }),
  setDiffEditor: (diffEditor) => set({ diffEditor }),
  setLspWebSocket: (lspWebSocket) => set({ lspWebSocket }),
  setMarkers: (markers) => set({ markers }),
  toggleView: () => set((state) => ({ showDiffView: !state.showDiffView })),
}));

const getStoredItem = <T extends string>(
  key: string,
  validValues?: T[]
): T | null => {
  const stored = localStorage.getItem(key);
  return stored && (!validValues || validValues.includes(stored as T))
    ? (stored as T)
    : null;
};

const getLanguage = (problemId: string): Language =>
  getStoredItem(`${problemId}_language`, LANGUAGES) ??
  getStoredItem("global_language", LANGUAGES) ??
  Language.c;

const getValue = (
  problemId: string,
  language: Language,
  templates: Template[]
): string =>
  getStoredItem(`${problemId}_${language}`) ??
  templates.find((t) => t.language === language)?.content ??
  "";

export const getPath = (problemId: string, language: Language) => {
  return `file:///${problemId}/main.${language}`;
};
