import { MonacoTheme } from "@/types/monaco-theme";
import { EditorLanguage } from "@/generated/client";
import { createHighlighter, Highlighter } from "shiki";

// Get all values from the ProgrammingLanguage and Theme enums
const themes = Object.values(MonacoTheme);
const languages = [...Object.values(EditorLanguage), "markdown"];

// Use lazy initialization for highlighter
let highlighter: Highlighter;

const initializeHighlighter = async () => {
  try {
    highlighter = await createHighlighter({
      themes: themes, // Use all values from the Theme enum
      langs: languages, // Use all values from the ProgrammingLanguage enum
    });
  } catch (error) {
    console.error("Error initializing highlighter:", error);
  }
}

initializeHighlighter();

export { highlighter };
