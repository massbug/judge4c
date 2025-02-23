import * as monaco from "monaco-editor"

export const CODE_EDITOR_OPTIONS: monaco.editor.IEditorConstructionOptions = {
  autoIndent: "full",
  automaticLayout: true,
  contextmenu: true,
  fontFamily: "Fira Code",
  fontLigatures: true,
  fontSize: 14,
  guides: {
    bracketPairs: true,
    indentation: true,
  },
  hideCursorInOverviewRuler: true,
  lineHeight: 20,
  matchBrackets: "always",
  minimap: {
    enabled: false
  },
  padding: {
    top: 8
  },
  readOnly: false,
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 18
  },
  showFoldingControls: "always",
  wordWrap: "on",
}
