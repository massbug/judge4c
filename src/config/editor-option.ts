import { type editor } from "monaco-editor";

export const DefaultEditorOptionConfig: editor.IEditorConstructionOptions = {
  fontFamily: "Fira Code",
  fontLigatures: true,
  lineHeight: 20,
  fontSize: 14,
  bracketPairColorization: {
    enabled: true,
  },
  showFoldingControls: "always",
  guides: {
    bracketPairs: true,
    bracketPairsHorizontal: "active",
    highlightActiveBracketPair: true,
    highlightActiveIndentation: "always",
    indentation: true,
  },
  hover: {
    above: false,
  },
  scrollbar: {
    horizontalSliderSize: 10,
    verticalSliderSize: 10,
  },
  wordWrap: "on",
  minimap: {
    enabled: false,
  },
  smoothScrolling: true,
  stickyScroll: {
    enabled: true,
    maxLineCount: 5,
  },
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  suggestSelection: "recentlyUsed",
  autoIndent: "full",
  automaticLayout: true,
  contextmenu: true,
  matchBrackets: "always",
};
