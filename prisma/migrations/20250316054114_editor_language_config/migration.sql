-- CreateTable
CREATE TABLE "EditorLanguageConfig" (
    "id" TEXT NOT NULL,
    "language" "EditorLanguage" NOT NULL,
    "label" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileExtension" TEXT NOT NULL,

    CONSTRAINT "EditorLanguageConfig_pkey" PRIMARY KEY ("id")
);
