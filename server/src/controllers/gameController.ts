import { sign, verify } from 'jsonwebtoken';
import {
  CreatedBingo,
  Game,
  Invite,
  Leaderboard,
  NUM_CHARS_JOIN_CODE,
  NUM_CHARS_SUPERPOWER_BOX_CODE,
  Superhero,
  SuperheroResult,
} from 'shared';

import prisma from 'lib/prisma';
import { makeCode } from 'utils/codeUtils';

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

  const joinCode = makeCode(NUM_CHARS_JOIN_CODE);
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

  const createdInvites = await Promise.all(
    bingo.superpowers.map((s) => {
      const inviteCode = makeCode(NUM_CHARS_SUPERPOWER_BOX_CODE);
      return prisma.heroPowerPairingInvites.create({
        data: {
          superpowerId: s.id,
          ownerId: user.id,
          inviteCode,
        },
        include: {
          owner: true,
          superpower: true,
        },
      });
    })
  );

  const invites: Invite[] = createdInvites.map((i) => ({
    ...i,
    superpowerDescription: i.superpower.description,
    ownerName: i.owner.name,
  }));

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

export const fetchGameOwnerCode = async (
  ownerCode: string
): Promise<{
  game: Game;
  bingo: CreatedBingo;
  leaderboard: Leaderboard;
}> => {
  const bingo = await prisma.bingo.findUnique({
    where: {
      ownerCode,
    },
    include: {
      superpowers: true,
    },
  });
  if (bingo == null) {
    throw new Error('Invalid owner code!');
  }
  const games = await prisma.game.findMany({
    where: {
      bingoId: bingo.id,
    },
    include: {
      heroes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });
  if (games.length === 0) {
    throw new Error('No game exists for bingo with provided owner code!');
  }
  const superheroes = await prisma.superhero.findMany({
    where: {
      gameId: games[0].id,
    },
    include: {
      pairings: true,
    },
  });

  const leaderboard = superheroes.reduce((acc: Leaderboard, s) => {
    acc[s.id] = s.pairings.length;
    return acc;
  }, {});

  return { game: games[0], bingo, leaderboard };
};

export const fetchGameUserToken = async (
  token: string
): Promise<{
  game: Game;
  bingo: CreatedBingo;
  user: Superhero;
  token: string;
  invites: Invite[];
  leaderboard: Leaderboard;
}> => {
  let payload;
  try {
    payload = verify(token, process.env.JWT_SECRET!);
    if (typeof payload !== 'object') {
      throw new Error();
    }
  } catch (error) {
    throw new Error('Invalid token provided!');
  }
  const user = await prisma.superhero.findUnique({
    where: {
      id: payload.userId,
    },
  });
  if (user == null) {
    throw new Error('No such user exists!');
  }
  const game = await prisma.game.findUnique({
    where: {
      id: user.gameId,
    },
    include: {
      heroes: true,
    },
  });
  if (game == null) {
    throw new Error('Invalid token provided!');
  }
  const bingo = await prisma.bingo.findUnique({
    where: {
      id: game.bingoId,
    },
    include: {
      superpowers: true,
    },
  });
  if (bingo == null) {
    throw new Error('Invalid bingo!');
  }
  const superheroes = await prisma.superhero.findMany({
    where: {
      gameId: game.id,
    },
    include: {
      pairings: true,
    },
  });

  const leaderboard = superheroes.reduce((acc: Leaderboard, s) => {
    acc[s.id] = s.pairings.length;
    return acc;
  }, {});

  const queriedInvites = await prisma.heroPowerPairingInvites.findMany({
    where: {
      ownerId: payload.userId,
    },
    include: {
      superpower: true,
      owner: true,
    },
  });
  const pairings = await prisma.heroPowerPairing.findMany({
    where: {
      ownerId: payload.userId,
    },
    include: {
      signee: true,
    },
  });

  const invites: Invite[] = queriedInvites.map((i) => ({
    ...i,
    superpowerDescription: i.superpower.description,
    ownerName: i.owner.name,
    signeeId: pairings.find((p) => p.superpowerId === i.superpowerId)?.signeeId,
    signeeName: pairings.find((p) => p.superpowerId === i.superpowerId)?.signee
      .name,
  }));

  return { game, bingo, user, token, leaderboard, invites };
};

// Returns the game ID so that the socket can broadcast this message.
export const leaveGame = async (
  token: string
): Promise<{
  gameId: number;
  superheroId: number;
  leaderboard: Leaderboard;
}> => {
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

  const superheroes = await prisma.superhero.findMany({
    where: {
      gameId: payload.gameId,
    },
    include: {
      pairings: true,
    },
  });

  const leaderboard = superheroes.reduce((acc: Leaderboard, s) => {
    acc[s.id] = s.pairings.length;
    return acc;
  }, {});

  return { gameId: payload.gameId, superheroId: payload.userId, leaderboard };
};

export const startGame = async (
  gameId: number,
  ownerCode: string
): Promise<{ game: Game; bingo: CreatedBingo }> => {
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
      startedAt: new Date(),
    },
    include: {
      heroes: true,
    },
  });
  const bingo = await prisma.bingo.findUnique({
    where: {
      id: updatedGame.bingoId,
    },
    include: {
      superpowers: true,
    },
  });
  if (bingo == null) {
    throw new Error('The bingo seems to have been deleted!');
  }
  return { game: updatedGame, bingo };
};

export const endGame = async (
  gameId: number,
  ownerCode: string
): Promise<SuperheroResult[]> => {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      bingo: true,
    },
  });
  if (game == null) {
    throw new Error('Invalid game ID provided!');
  }
  if (game.hasEnded) {
    throw new Error('This game has already ended!');
  }
  if (game.bingo.ownerCode !== ownerCode) {
    throw new Error('You do not have permissions to end this game!');
  }

  const updatedGame = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      hasEnded: true,
    },
    include: {
      heroes: true,
    },
  });

  return await Promise.all(
    updatedGame.heroes.map(async (hero) => {
      const powersInOwnBingoSigned = await prisma.heroPowerPairing.findMany({
        where: {
          ownerId: hero.id,
        },
      });
      let timeWhenLastPowerInOwnBingoWasSigned = undefined;
      if (powersInOwnBingoSigned.length > 0) {
        timeWhenLastPowerInOwnBingoWasSigned = new Date(
          Math.max.apply(
            null,
            powersInOwnBingoSigned.map((p) => p.createdAt.getTime())
          )
        );
      }
      const numPowersInOwnBingoSigned = powersInOwnBingoSigned.length;

      const powersInOthersBingoSigned = await prisma.heroPowerPairing.findMany({
        where: {
          signeeId: hero.id,
        },
      });
      const numPowersInOthersBingoSigned = powersInOthersBingoSigned.length;
      const numDifferentPowersInOthersBingoSigned = powersInOthersBingoSigned
        .map((p) => p.superpowerId)
        .reduce(
          (acc: Set<number>, id: number) => acc.add(id),
          new Set<number>()
        ).size;
      return {
        superhero: hero,
        timeWhenLastPowerInOwnBingoWasSigned,
        numPowersInOwnBingoSigned,
        numPowersInOthersBingoSigned,
        numDifferentPowersInOthersBingoSigned,
      };
    })
  );
};
