import { Game } from 'shared';

import prisma from 'lib/prisma';
import { makeCode } from 'utils/codeUtils';

const JOIN_CODE_LENGTH = 6;

export const createGame = async (ownerCode: string): Promise<Game> => {
  const bingo = await prisma.bingo.findUnique({
    where: {
      ownerCode,
    },
  });
  if (bingo == null) {
    throw new Error('Invalid game ID provided!');
  }
  const numActiveGames = await prisma.game.count({
    where: {
      bingoId: bingo.id,
      hasStarted: true,
      hasEnded: false,
    },
  });
  if (numActiveGames > 0) {
    throw new Error('There is already an ongoing game!');
  }

  const joinCode = makeCode(JOIN_CODE_LENGTH);
  return await prisma.game.create({
    data: {
      bingoId: bingo.id,
      joinCode,
    },
    include: {
      heroes: true,
    },
  });
};
