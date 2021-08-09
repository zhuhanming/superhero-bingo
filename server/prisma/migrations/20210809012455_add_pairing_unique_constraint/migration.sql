/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,superpowerId]` on the table `HeroPowerPairing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HeroPowerPairing.ownerId_superpowerId_unique" ON "HeroPowerPairing"("ownerId", "superpowerId");
