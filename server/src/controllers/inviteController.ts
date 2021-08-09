import { Invite } from 'shared';

import prisma from 'lib/prisma';

export const fetchInvite = async (inviteCode: string): Promise<Invite> => {
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
