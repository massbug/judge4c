/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Problem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'zh');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description",
DROP COLUMN "solution",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "ProblemTitle" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "content" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemDescription" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "content" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemSolution" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "content" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "ProblemSolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemTitle_problemId_language_key" ON "ProblemTitle"("problemId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemDescription_problemId_language_key" ON "ProblemDescription"("problemId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSolution_problemId_language_key" ON "ProblemSolution"("problemId", "language");

-- AddForeignKey
ALTER TABLE "ProblemTitle" ADD CONSTRAINT "ProblemTitle_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemDescription" ADD CONSTRAINT "ProblemDescription_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolution" ADD CONSTRAINT "ProblemSolution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
