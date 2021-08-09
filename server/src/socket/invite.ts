import { ERROR_FETCH_INVITE, RES_FETCH_INVITE } from 'shared';
import { Server, Socket } from 'socket.io';

import * as InviteController from 'controllers/inviteController';

type FetchInviteFunction = (inviteCode: string) => Promise<void>;

export const socketFetchInvite = (
  _io: Server,
  socket: Socket
): FetchInviteFunction => {
  return async (inviteCode: string): Promise<void> => {
    console.log('REQ_FETCH_INVITE');
    console.log('Invite code received: ', inviteCode);

    try {
      const invite = await InviteController.fetchInvite(inviteCode);
      socket.emit(RES_FETCH_INVITE, invite);
    } catch (error) {
      socket.emit(ERROR_FETCH_INVITE, error.message);
    }
  };
};
