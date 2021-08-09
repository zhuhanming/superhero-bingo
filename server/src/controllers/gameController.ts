import { sign, verify } from 'jsonwebtoken';
import { CreatedBingo, Game, Invite, Superhero } from 'shared';

import prisma from 'lib/prisma';
import { makeCode } from 'utils/codeUtils';

const JOIN_CODE_LENGTH = 6;
const INVITE_CODE_LENGTH = 8;

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
  invites: Invite[];
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
  if (game.hasEnded) {
    throw new Error('The game has already ended!');
  }
  if (game.hasStarted) {
    throw new Error('The game has already started!');
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

  const invites = await Promise.all(
    bingo.superpowers.map((s) => {
      const inviteCode = makeCode(INVITE_CODE_LENGTH);
      return prisma.heroPowerPairingInvites.create({
        data: {
          superpowerId: s.id,
          ownerId: user.id,
          inviteCode,
        },
      });
    })
  );

  const tokenPayload = {
    userId: user.id,
    gameId: game.id,
    name,
  };
  const token = sign(tokenPayload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return { game, bingo, user, token, invites };
};

export const fetchGame = async (gameId: number): Promise<Game> => {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      heroes: true,
    },
  });
  if (game === null) {
    throw new Error('Invalid game ID provided!');
  }
  return game;
};

// Returns the game ID so that the socket can broadcast this message.
export const leaveGame = async (
  token: string
): Promise<{ gameId: number; superheroId: number }> => {
  let payload;
  try {
    payload = verify(token, process.env.JWT_SECRET!);
    if (typeof payload !== 'object') {
      throw new Error();
    }
  } catch (error) {
    throw new Error('Invalid token provided!');
  }

  const hero = await prisma.superhero.findUnique({
    where: {
      id: payload.userId,
    },
  });
  if (
    hero === null ||
    hero.gameId !== payload.gameId ||
    hero.name !== payload.name
  ) {
    throw new Error('Invalid credentials stored in token!');
  }

  await prisma.superhero.delete({
    where: {
      id: hero.id,
    },
  });

  return { gameId: payload.gameId, superheroId: payload.userId };
};

export const startGame = async (
  gameId: number,
  ownerCode: string
): Promise<Game> => {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      bingo: true,
    },
  });
  if (game === null) {
    throw new Error('The game cannot be found!');
  }
  if (game.hasStarted || game.hasEnded) {
    throw new Error('The game has already started or ended!');
  }
  if (game.bingo.ownerCode !== ownerCode) {
    throw new Error('You are not the owner of this bingo!');
  }
  const updatedGame = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      hasStarted: true,
    },
    include: {
      heroes: true,
    },
  });
  return updatedGame;
};
