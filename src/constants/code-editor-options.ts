import * as monaco from "monaco-editor"

export const CODE_EDITOR_OPTIONS: monaco.editor.IEditorConstructionOptions = {
  autoIndent: "full",
  automaticLayout: true,
  contextmenu: true,
  fontFamily: "Fira Code",
  fontLigatures: true,
  fontSize: 14,
  lineHeight: 20,
  hideCursorInOverviewRuler: true,
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
  }
}
