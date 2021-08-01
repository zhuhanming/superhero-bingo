-- CreateTable
CREATE TABLE "Bingo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ownerCode" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "joinCode" TEXT NOT NULL,
    "bingoId" INTEGER NOT NULL,
    "isOngoing" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Superpower" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "bingoId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Superhero" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroPowerPairing" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "superpowerId" INTEGER NOT NULL,
    "signeeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroPowerPairingInvites" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "superpowerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bingo.ownerCode_unique" ON "Bingo"("ownerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Game.joinCode_unique" ON "Game"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Superpower.description_bingoId_unique" ON "Superpower"("description", "bingoId");

-- CreateIndex
CREATE UNIQUE INDEX "Superhero.name_gameId_unique" ON "Superhero"("name", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "HeroPowerPairing.ownerId_signeeId_unique" ON "HeroPowerPairing"("ownerId", "signeeId");

-- CreateIndex
CREATE UNIQUE INDEX "HeroPowerPairingInvites.inviteCode_unique" ON "HeroPowerPairingInvites"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "HeroPowerPairingInvites.ownerId_superpowerId_unique" ON "HeroPowerPairingInvites"("ownerId", "superpowerId");

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("bingoId") REFERENCES "Bingo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Superpower" ADD FOREIGN KEY ("bingoId") REFERENCES "Bingo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Superhero" ADD FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroPowerPairing" ADD FOREIGN KEY ("ownerId") REFERENCES "Superhero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroPowerPairing" ADD FOREIGN KEY ("superpowerId") REFERENCES "Superpower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroPowerPairing" ADD FOREIGN KEY ("signeeId") REFERENCES "Superhero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroPowerPairingInvites" ADD FOREIGN KEY ("ownerId") REFERENCES "Superhero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroPowerPairingInvites" ADD FOREIGN KEY ("superpowerId") REFERENCES "Superpower"("id") ON DELETE CASCADE ON UPDATE CASCADE;
