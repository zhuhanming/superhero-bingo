import { verify } from 'jsonwebtoken';
import { Invite, Superhero } from 'shared';

import prisma from 'lib/prisma';

export const fetchInvite = async (
  inviteCode: string,
  token: string
): Promise<Invite> => {
  let payload;
  try {
    payload = verify(token, process.env.JWT_SECRET!);
    if (typeof payload !== 'object') {
      throw new Error();
    }
  } catch (error) {
    throw new Error('Invalid token provided!');
  }

  const invite = await prisma.heroPowerPairingInvites.findUnique({
    where: {
      inviteCode,
    },
    include: {
      superpower: true,
      owner: true,
    },
  });
  if (invite == null) {
    throw new Error('Invalid invite code provided!');
  }
  if (invite.owner.gameId !== payload.gameId) {
    throw new Error('Unable to fetch invitation from another game!');
  }

  const pairing = await prisma.heroPowerPairing.findUnique({
    where: {
      ownerId_superpowerId: {
        ownerId: invite.ownerId,
        superpowerId: invite.superpowerId,
      },
    },
    include: {
      signee: true,
    },
  });

  return {
    ...invite,
    superpowerDescription: invite.superpower.description,
    ownerName: invite.owner.name,
    signeeId: pairing?.signeeId,
    signeeName: pairing?.signee.name,
  };
};

export const signInvite = async (
  inviteCode: string,
  token: string
): Promise<{
  ownerId: number;
  numSigned: number;
  signee: Superhero;
  superpowerId: number;
  inviteId: number;
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

  const invite = await prisma.heroPowerPairingInvites.findUnique({
    where: {
      inviteCode,
    },
    include: {
      owner: true,
    },
  });
  if (invite == null) {
    throw new Error('Invalid invite code provided!');
  }
  if (invite.owner.gameId !== payload.gameId) {
    throw new Error('Unable to sign invitation from another game!');
  }
  if (invite.ownerId === payload.userId) {
    throw new Error('You cannot sign for yourself!');
  }

  let existingPairing = await prisma.heroPowerPairing.findUnique({
    where: {
      ownerId_superpowerId: {
        ownerId: invite.ownerId,
        superpowerId: invite.superpowerId,
      },
    },
  });
  if (existingPairing != null) {
    throw new Error('This superpower has already been signed by someone else!');
  }

  existingPairing = await prisma.heroPowerPairing.findUnique({
    where: {
      ownerId_signeeId: {
        ownerId: invite.ownerId,
        signeeId: payload.userId,
      },
    },
  });
  if (existingPairing != null) {
    throw new Error('You have previously signed for this user!');
  }

  const pairing = await prisma.heroPowerPairing.create({
    data: {
      ownerId: invite.ownerId,
      superpowerId: invite.superpowerId,
      signeeId: payload.userId,
    },
    include: {
      signee: true,
    },
  });

  const numSigned = await prisma.heroPowerPairing.count({
    where: {
      ownerId: invite.ownerId,
    },
  });

  return {
    ownerId: invite.ownerId,
    numSigned,
    signee: pairing.signee,
    superpowerId: invite.superpowerId,
    inviteId: invite.id,
  };
};
