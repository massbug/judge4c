/*
  Warnings:

  - The primary key for the `DockerConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LanguageServerConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `timeUsage` on the `Submission` table. All the data in the column will be lost.
  - The primary key for the `Template` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `timeUsage` on the `TestcaseResult` table. All the data in the column will be lost.
  - You are about to drop the `ProblemLocalization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestcaseInput` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[language]` on the table `DockerConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[language]` on the table `LanguageServerConfig` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `language` on the `DockerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `LanguageServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `protocol` on the `LanguageServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `description` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solution` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Problem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `code` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `template` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `Template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `output` on table `TestcaseResult` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EditorLanguage" AS ENUM ('c', 'cpp');

-- CreateEnum
CREATE TYPE "LanguageServerProtocol" AS ENUM ('ws', 'wss');

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemLocalization" DROP CONSTRAINT "ProblemLocalization_problemId_fkey";

-- DropForeignKey
ALTER TABLE "TestcaseInput" DROP CONSTRAINT "TestcaseInput_testcaseId_fkey";

-- AlterTable
ALTER TABLE "DockerConfig" DROP CONSTRAINT "DockerConfig_pkey",
DROP COLUMN "language",
ADD COLUMN     "language" "EditorLanguage" NOT NULL,
ALTER COLUMN "compileOutputLimit" DROP DEFAULT,
ALTER COLUMN "runOutputLimit" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LanguageServerConfig" DROP CONSTRAINT "LanguageServerConfig_pkey",
DROP COLUMN "language",
ADD COLUMN     "language" "EditorLanguage" NOT NULL,
DROP COLUMN "protocol",
ADD COLUMN     "protocol" "LanguageServerProtocol" NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "createdAt",
DROP COLUMN "isPublished",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solution" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "memoryLimit" SET DEFAULT 128,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "content",
DROP COLUMN "timeUsage",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "executionTime" INTEGER,
DROP COLUMN "language",
ADD COLUMN     "language" "EditorLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "Template" DROP CONSTRAINT "Template_pkey",
DROP COLUMN "content",
ADD COLUMN     "template" TEXT NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "EditorLanguage" NOT NULL,
ADD CONSTRAINT "Template_pkey" PRIMARY KEY ("problemId", "language");

-- AlterTable
ALTER TABLE "Testcase" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "TestcaseResult" DROP COLUMN "timeUsage",
ADD COLUMN     "executionTime" INTEGER,
ALTER COLUMN "output" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "ProblemLocalization";

-- DropTable
DROP TABLE "TestcaseInput";

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "Locale";

-- DropEnum
DROP TYPE "ProblemContentType";

-- DropEnum
DROP TYPE "Protocol";

-- CreateTable
CREATE TABLE "EditorLanguageConfig" (
    "language" "EditorLanguage" NOT NULL,
    "label" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileExtension" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TestcaseData" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,

    CONSTRAINT "TestcaseData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditorLanguageConfig_language_key" ON "EditorLanguageConfig"("language");

-- CreateIndex
CREATE UNIQUE INDEX "DockerConfig_language_key" ON "DockerConfig"("language");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageServerConfig_language_key" ON "LanguageServerConfig"("language");

-- CreateIndex
CREATE INDEX "Problem_userId_idx" ON "Problem"("userId");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageServerConfig" ADD CONSTRAINT "LanguageServerConfig_language_fkey" FOREIGN KEY ("language") REFERENCES "EditorLanguageConfig"("language") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DockerConfig" ADD CONSTRAINT "DockerConfig_language_fkey" FOREIGN KEY ("language") REFERENCES "EditorLanguageConfig"("language") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestcaseData" ADD CONSTRAINT "TestcaseData_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
