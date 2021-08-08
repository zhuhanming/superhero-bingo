/*
  Warnings:

  - You are about to drop the column `isOngoing` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "isOngoing",
ADD COLUMN     "hasEnded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasStarted" BOOLEAN NOT NULL DEFAULT false;
