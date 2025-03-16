-- CreateTable
CREATE TABLE "DockerConfig" (
    "language" "EditorLanguage" NOT NULL,
    "image" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "workingDir" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "memoryLimit" INTEGER NOT NULL,
    "compileOutputLimit" INTEGER NOT NULL,
    "runOutputLimit" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DockerConfig_language_key" ON "DockerConfig"("language");

-- AddForeignKey
ALTER TABLE "DockerConfig" ADD CONSTRAINT "DockerConfig_language_fkey" FOREIGN KEY ("language") REFERENCES "EditorLanguageConfig"("language") ON DELETE RESTRICT ON UPDATE CASCADE;
