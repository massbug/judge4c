export enum EditorLanguage {
  C = "c",
  CPP = "cpp",
}

export type EditorLanguageMetadata = {
  id: EditorLanguage;
  label: string;
  fileName: string;
  fileExtension: string;
};
