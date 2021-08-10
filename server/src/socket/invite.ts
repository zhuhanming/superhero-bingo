import {
  ERROR_FETCH_INVITE,
  ERROR_SIGN_INVITE,
  NOTIF_OWNER_SIGN_INVITE,
  NOTIF_SIGN_INVITE,
  RES_FETCH_INVITE,
  RES_SIGN_INVITE,
} from 'shared';
import { Server, Socket } from 'socket.io';

import * as InviteController from 'controllers/inviteController';

type FetchInviteFunction = (data: {
  inviteCode: string;
  token: string;
}) => Promise<void>;
type SignInviteFunction = (data: {
  inviteCode: string;
  token: string;
}) => Promise<void>;

export const socketFetchInvite = (
  _io: Server,
  socket: Socket
): FetchInviteFunction => {
  return async (data: { inviteCode: string; token: string }): Promise<void> => {
    console.log('REQ_FETCH_INVITE');
    console.log('Invite code received: ', data.inviteCode);
    console.log('Token received: ', data.token);

    try {
      const invite = await InviteController.fetchInvite(
        data.inviteCode,
        data.token
      );
      socket.emit(RES_FETCH_INVITE, invite);
    } catch (error) {
      socket.emit(ERROR_FETCH_INVITE, error.message);
    }
  };
};

export const socketSignInvite = (
  io: Server,
  socket: Socket
): SignInviteFunction => {
  return async (data: { inviteCode: string; token: string }): Promise<void> => {
    console.log('REQ_SIGN_INVITE');
    console.log('Invite code received: ', data.inviteCode);
    console.log('Token received: ', data.token);

    try {
      const { ownerId, numSigned, signee, superpowerId, inviteId } =
        await InviteController.signInvite(data.inviteCode, data.token);
      socket.emit(RES_SIGN_INVITE, { superpowerId, signee });
      io.in(`room-${signee.gameId}`).emit(NOTIF_SIGN_INVITE, {
        ownerId,
        numSigned,
        inviteId,
        signee,
      });
      io.in(`room-${signee.gameId}-owner`).emit(NOTIF_OWNER_SIGN_INVITE, {
        ownerId,
        inviteId,
        signee,
      });
    } catch (error) {
      socket.emit(ERROR_SIGN_INVITE, error.message);
    }
  };
};
