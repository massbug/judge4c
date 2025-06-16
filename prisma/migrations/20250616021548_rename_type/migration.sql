/*
  Warnings:

  - You are about to drop the column `type` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `answerType` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('NS', 'INT', 'FLOAT', 'CHAR', 'INTARRAY', 'FLOATARRAY', 'STRING', 'MATRIX');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "type",
ADD COLUMN     "answerType" "AnswerType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
