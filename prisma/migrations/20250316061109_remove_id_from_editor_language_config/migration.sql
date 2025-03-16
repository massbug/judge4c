/*
  Warnings:

  - The primary key for the `EditorLanguageConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EditorLanguageConfig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[language]` on the table `EditorLanguageConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EditorLanguageConfig" DROP CONSTRAINT "EditorLanguageConfig_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "EditorLanguageConfig_language_key" ON "EditorLanguageConfig"("language");
