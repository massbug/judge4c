/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `executionTime` on the `Submission` table. All the data in the column will be lost.
  - The primary key for the `Template` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `template` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `executionTime` on the `TestcaseResult` table. All the data in the column will be lost.
  - You are about to drop the `EditorLanguageConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestcaseData` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `language` on the `DockerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `LanguageServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `protocol` on the `LanguageServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `content` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `Template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Testcase` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'zh');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('c', 'cpp');

-- CreateEnum
CREATE TYPE "Protocol" AS ENUM ('ws', 'wss');

-- CreateEnum
CREATE TYPE "ProblemContentType" AS ENUM ('TITLE', 'DESCRIPTION', 'SOLUTION');

-- DropForeignKey
ALTER TABLE "DockerConfig" DROP CONSTRAINT "DockerConfig_language_fkey";

-- DropForeignKey
ALTER TABLE "LanguageServerConfig" DROP CONSTRAINT "LanguageServerConfig_language_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestcaseData" DROP CONSTRAINT "TestcaseData_testcaseId_fkey";

-- DropIndex
DROP INDEX "DockerConfig_language_key";

-- DropIndex
DROP INDEX "LanguageServerConfig_language_key";

-- DropIndex
DROP INDEX "Problem_difficulty_idx";

-- DropIndex
DROP INDEX "Problem_userId_idx";

-- AlterTable
ALTER TABLE "DockerConfig" ALTER COLUMN "compileOutputLimit" SET DEFAULT 1048576,
ALTER COLUMN "runOutputLimit" SET DEFAULT 1048576,
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
ADD CONSTRAINT "DockerConfig_pkey" PRIMARY KEY ("language");

-- AlterTable
ALTER TABLE "LanguageServerConfig" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
DROP COLUMN "protocol",
ADD COLUMN     "protocol" "Protocol" NOT NULL,
ADD CONSTRAINT "LanguageServerConfig_pkey" PRIMARY KEY ("language");

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description",
DROP COLUMN "published",
DROP COLUMN "solution",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "memoryLimit" SET DEFAULT 134217728,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "code",
DROP COLUMN "executionTime",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "timeUsage" INTEGER,
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "Template" DROP CONSTRAINT "Template_pkey",
DROP COLUMN "template",
ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
ADD CONSTRAINT "Template_pkey" PRIMARY KEY ("problemId", "language");

-- AlterTable
ALTER TABLE "Testcase" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TestcaseResult" DROP COLUMN "executionTime",
ADD COLUMN     "timeUsage" INTEGER,
ALTER COLUMN "output" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "EditorLanguageConfig";

-- DropTable
DROP TABLE "TestcaseData";

-- DropEnum
DROP TYPE "EditorLanguage";

-- DropEnum
DROP TYPE "LanguageServerProtocol";

-- CreateTable
CREATE TABLE "ProblemLocalization" (
    "problemId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "type" "ProblemContentType" NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ProblemLocalization_pkey" PRIMARY KEY ("problemId","locale","type")
);

-- CreateTable
CREATE TABLE "TestcaseInput" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,

    CONSTRAINT "TestcaseInput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLocalization" ADD CONSTRAINT "ProblemLocalization_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestcaseInput" ADD CONSTRAINT "TestcaseInput_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
