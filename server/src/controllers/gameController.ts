import { sign } from 'jsonwebtoken';
import { CreatedBingo, Game, Superhero } from 'shared';

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

export const joinGame = async (
  joinCode: string,
  name: string
): Promise<{
  game: Game;
  bingo: CreatedBingo;
  user: Superhero;
  token: string;
}> => {
  const game = await prisma.game.findUnique({
    where: {
      joinCode,
    },
    include: {
      heroes: true,
    },
  });
  if (game === null) {
    throw new Error('Invalid room code provided!');
  }
  const bingo = await prisma.bingo.findUnique({
    where: {
      id: game.bingoId,
    },
    include: {
      superpowers: true,
    },
  });
  if (bingo === null) {
    throw new Error('Something went wrong! Please get a new room code.');
  }
  const hasExistingUserWithSameName = await prisma.superhero.count({
    where: {
      name,
      gameId: game.id,
    },
  });

  if (hasExistingUserWithSameName > 0) {
    throw new Error('This name is already used! Try another name!');
  }

  const user = await prisma.superhero.create({
    data: {
      name,
      gameId: game.id,
    },
  });
  game.heroes.push(user);

  const tokenPayload = {
    userId: user.id,
    gameId: game.id,
    name,
  };
  const token = sign(tokenPayload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return { game, bingo, user, token };
};
