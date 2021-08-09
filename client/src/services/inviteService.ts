import { toast } from 'react-toastify';
import {
  ERROR_FETCH_INVITE,
  ERROR_SIGN_INVITE,
  Invite,
  NOTIF_SIGN_INVITE,
  REQ_FETCH_INVITE,
  REQ_SIGN_INVITE,
  RES_FETCH_INVITE,
  RES_SIGN_INVITE,
  Superhero,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import {
  clearInviteToSign,
  setInviteToSign,
  trySignInvitation,
  updateSuperheroScore,
} from 'reducers/gameDux';

export const fetchInvite = (
  socket: Socket,
  inviteCode: string,
  token: string
): void => {
  socket.emit(REQ_FETCH_INVITE, { inviteCode, token });
};

const receivedInvite = (socket: Socket): void => {
  socket.on(RES_FETCH_INVITE, (payload: Invite) => {
    store.dispatch(setInviteToSign(payload));
  });
};

const onErrorFetchInvite = (socket: Socket): void => {
  socket.on(ERROR_FETCH_INVITE, (payload: string) => {
    toast(payload, { type: 'error' });
  });
};

export const signInvite = (
  socket: Socket,
  inviteCode: string,
  token: string
): void => {
  socket.emit(REQ_SIGN_INVITE, { inviteCode, token });
};

const signedInvite = (socket: Socket): void => {
  socket.on(
    RES_SIGN_INVITE,
    (payload: { superpowerId: number; signee: Superhero }) => {
      store.dispatch(clearInviteToSign());
      toast(`Successfully signed for ${payload.signee.name}!`, {
        type: 'success',
      });
    }
  );
};

const onErrorSignInvite = (socket: Socket): void => {
  socket.on(ERROR_SIGN_INVITE, (payload: string) => {
    toast(payload, { type: 'error' });
  });
};

const onNotifSignInvite = (socket: Socket): void => {
  socket.on(
    NOTIF_SIGN_INVITE,
    (payload: {
      ownerId: number;
      numSigned: number;
      inviteId: number;
      signee: Superhero;
    }) => {
      store.dispatch(
        updateSuperheroScore({
          superheroId: payload.ownerId,
          score: payload.numSigned,
        })
      );
      store.dispatch(
        trySignInvitation({
          ownerId: payload.ownerId,
          inviteId: payload.inviteId,
          signee: payload.signee,
        })
      );
    }
  );
};

export const initializeSocketForInvite = (socket: Socket): void => {
  receivedInvite(socket);
  onErrorFetchInvite(socket);
  signedInvite(socket);
  onErrorSignInvite(socket);
  onNotifSignInvite(socket);
};
