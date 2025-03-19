import { EditorLanguage } from "@prisma/client";
import { useEffect, useState, useCallback } from "react";
import { useProblemEditorStore } from "@/store/useProblemEditorStore";

/**
 * Generates a unique localStorage key for storing the editor language of a problem.
 */
const getProblemLangStorageKey = (problemId: string) => `${problemId}_lang`;

/**
 * Retrieves the stored editor language for a specific problem.
 * If no value is found, it falls back to the global editor language.
 */
const getStoredProblemLang = (problemId: string, globalEditorLanguage: EditorLanguage): EditorLanguage => {
  return (localStorage.getItem(getProblemLangStorageKey(problemId)) as EditorLanguage) ?? globalEditorLanguage;
};

/**
 * Hook for managing the editor language of a specific problem.
 */
export const useProblemEditor = (problemId: string) => {
  const { globalEditorLanguage, setGlobalEditorLanguage } = useProblemEditorStore();

  // Local state to track the current editor language for the problem
  const [currentLang, setCurrentLang] = useState<EditorLanguage>(() => 
    getStoredProblemLang(problemId, globalEditorLanguage)
  );

  // Update local state when the problemId or global editor language changes
  useEffect(() => {
    setCurrentLang(getStoredProblemLang(problemId, globalEditorLanguage));
  }, [problemId, globalEditorLanguage]);

  /**
   * Changes the editor language for the current problem.
   * Updates both global state and local storage.
   */
  const changeProblemLang = useCallback(
    (language: EditorLanguage) => {
      // Update global editor language state
      setGlobalEditorLanguage(language);

      // Persist the selected language in localStorage
      localStorage.setItem(getProblemLangStorageKey(problemId), language);

      // Update local state
      setCurrentLang(language);
    },
    [setGlobalEditorLanguage]
  );

  return { currentLang, changeProblemLang };
};
