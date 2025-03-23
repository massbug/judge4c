import { getPath } from "@/lib/utils";
import { EditorLanguage } from "@prisma/client";
import { useCallback, useEffect, useMemo } from "react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { useProblemStore } from "@/providers/problem-store-provider";

/**
 * Generates a localStorage key for storing the editor language of a problem.
 * Format: "lang_{problemId}"
 */
const getProblemLangStorageKey = (problemId: string) => `lang_${problemId}`;

/**
 * Generates a localStorage key for storing the editor content of a problem for a specific language.
 * Format: "{language}_{problemId}"
 */
const getProblemValueStorageKey = (problemId: string, language: EditorLanguage) =>
  `${language}_${problemId}`;

/**
 * Retrieves the stored editor language for a specific problem.
 * Falls back to the global language if no stored value is found.
 */
const getStoredProblemLang = (problemId: string, globalLang: EditorLanguage) =>
  (localStorage.getItem(getProblemLangStorageKey(problemId)) as EditorLanguage) ?? globalLang;

/**
 * Retrieves the stored editor content for a specific problem and language.
 * Falls back to the default template if no stored value is found.
 */
const getStoredProblemValue = (
  problemId: string,
  defaultValue: string,
  language: EditorLanguage
) => localStorage.getItem(getProblemValueStorageKey(problemId, language)) ?? defaultValue;

export const useProblem = () => {
  const { currentTheme } = useMonacoTheme();
  const {
    hydrated,
    editor,
    monacoLanguageClient,
    globalLang,
    currentLang,
    currentValue,
    setEditor,
    setMonacoLanguageClient,
    setGlobalLang,
    setCurrentLang,
    setCurrentValue,
    problemId,
    templates,
    editorLanguageConfigs,
    languageServerConfigs,
  } = useProblemStore((state) => state);

  // Get the default template for the current language from the templates list
  const currentTemplate = useMemo(
    () => templates.find((t) => t.language === currentLang)?.template || "",
    [templates, currentLang]
  );

  const currentEditorLanguageConfig = useMemo(
    () => editorLanguageConfigs.find((c) => c.language === currentLang),
    [editorLanguageConfigs, currentLang]
  );

  const currentLanguageServerConfig = useMemo(
    () => languageServerConfigs.find((c) => c.language === currentLang),
    [languageServerConfigs, currentLang]
  );

  const currentPath = useMemo(
    () => (currentEditorLanguageConfig ? getPath(problemId, currentEditorLanguageConfig) : ""),
    [problemId, currentEditorLanguageConfig]
  );

  // On initialization, load the stored language and corresponding code content
  useEffect(() => {
    const storedLang = getStoredProblemLang(problemId, globalLang);
    setCurrentLang(storedLang);

    const storedValue = getStoredProblemValue(problemId, currentTemplate, storedLang);
    setCurrentValue(storedValue);
  }, [problemId, globalLang, currentTemplate, setCurrentLang, setCurrentValue]);

  // Change the language and update localStorage and state accordingly
  const changeLang = useCallback(
    (newLang: EditorLanguage) => {
      if (!problemId || newLang === currentLang) return;

      // Update the stored language in localStorage
      localStorage.setItem(getProblemLangStorageKey(problemId), newLang);
      setCurrentLang(newLang);
      setGlobalLang(newLang);
    },
    [problemId, currentLang, setCurrentLang, setGlobalLang]
  );

  // Update the stored code content when the editor value changes, specific to the current language
  const changeValue = useCallback(
    (newValue: string) => {
      if (!problemId || newValue === currentValue) return;

      localStorage.setItem(getProblemValueStorageKey(problemId, currentLang), newValue);
      setCurrentValue(newValue);
    },
    [problemId, currentValue, currentLang, setCurrentValue]
  );

  return {
    hydrated,
    editor,
    monacoLanguageClient,
    setEditor,
    setMonacoLanguageClient,
    globalLang,
    currentLang,
    currentValue,
    problemId,
    templates,
    editorLanguageConfigs,
    languageServerConfigs,
    currentTemplate,
    currentEditorLanguageConfig,
    currentLanguageServerConfig,
    currentPath,
    currentTheme,
    changeLang,
    changeValue,
  };
};
