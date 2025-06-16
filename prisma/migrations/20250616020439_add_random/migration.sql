/*
  Warnings:

  - Added the required column `type` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('NS', 'INT', 'FLOAT', 'CHAR', 'INTARRAY', 'FLOATARRAY', 'STRING', 'MATRIX');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "isRandom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lengthOfArray" INTEGER[],
ADD COLUMN     "type" "Type" NOT NULL;
