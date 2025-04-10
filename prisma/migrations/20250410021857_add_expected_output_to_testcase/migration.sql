/*
  Warnings:

  - Added the required column `expectedOutput` to the `Testcase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testcase" ADD COLUMN     "expectedOutput" TEXT NOT NULL;
