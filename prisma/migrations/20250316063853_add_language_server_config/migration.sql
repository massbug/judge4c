-- CreateTable
CREATE TABLE "LanguageServerConfig" (
    "language" "EditorLanguage" NOT NULL,
    "protocol" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "port" INTEGER,
    "path" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "LanguageServerConfig_language_key" ON "LanguageServerConfig"("language");

-- AddForeignKey
ALTER TABLE "LanguageServerConfig" ADD CONSTRAINT "LanguageServerConfig_language_fkey" FOREIGN KEY ("language") REFERENCES "EditorLanguageConfig"("language") ON DELETE RESTRICT ON UPDATE CASCADE;
