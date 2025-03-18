/*
  Warnings:

  - Changed the type of `protocol` on the `LanguageServerConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LanguageServerProtocol" AS ENUM ('ws', 'wss');

-- AlterTable
ALTER TABLE "LanguageServerConfig" DROP COLUMN "protocol",
ADD COLUMN     "protocol" "LanguageServerProtocol" NOT NULL;
