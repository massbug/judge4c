import { EditorLanguage } from "@prisma/client";

export type EditorLanguageMetadata = {
  id: EditorLanguage,
  label: string;
  fileName: string;
  fileExtension: string;
  icon: React.FunctionComponent<React.SVGProps<SVGElement> & { size?: number | string }>;
};
