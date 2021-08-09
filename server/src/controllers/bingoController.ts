import { Bingo, CreatedBingo, UpdatedBingo, validateBingo } from 'shared';

import prisma from 'lib/prisma';
import { makeCode } from 'utils/codeUtils';

const OWNER_CODE_LENGTH = 6;

export const createBingo = async (bingoData: Bingo): Promise<CreatedBingo> => {
  validateBingo(bingoData);
  const ownerCode = makeCode(OWNER_CODE_LENGTH);
  return await prisma.bingo.create({
    data: {
      name: bingoData.name,
      ownerCode,
      superpowers: {
        create: bingoData.superpowers.map((s) => ({
          description: s.description,
          order: s.order,
        })),
      },
    },
    include: {
      superpowers: true,
    },
  });
};

export const updateBingo = async (
  bingoData: UpdatedBingo
): Promise<CreatedBingo> => {
  validateBingo(bingoData);

  const numActiveGames = await prisma.game.count({
    where: {
      bingoId: bingoData.id,
      hasStarted: true,
      hasEnded: false,
    },
  });
  if (numActiveGames > 0) {
    throw new Error('You cannot edit the bingo while a game is ongoing!');
  }

  // Update existing superpowers
  await Promise.all(
    bingoData.superpowers
      .filter((s) => s.id != null)
      .map((s) =>
        prisma.superpower.update({
          where: {
            id: s.id,
          },
          data: {
            description: s.description,
            order: s.order,
          },
        })
      )
  );

  // Delete removed superpowers
  await prisma.superpower.deleteMany({
    where: {
      bingoId: bingoData.id,
      id: {
        notIn: bingoData.superpowers
          .filter((s) => s.id != null)
          .map((s) => s.id!),
      },
    },
  });

  // Update bingo and create new superpowers
  return await prisma.bingo.update({
    where: {
      id: bingoData.id,
    },
    data: {
      name: bingoData.name,
      superpowers: {
        create: bingoData.superpowers
          .filter((s) => s.id == null)
          .map((s) => ({
            description: s.description,
            order: s.order,
          })),
      },
    },
    include: {
      superpowers: true,
    },
  });
};

export const fetchBingo = async (ownerCode: string): Promise<CreatedBingo> => {
  const bingo = await prisma.bingo.findUnique({
    where: {
      ownerCode,
    },
    include: {
      superpowers: true,
    },
  });
  if (bingo == null) {
    throw new Error('Invalid owner code provided!');
  }
  return bingo;
};
