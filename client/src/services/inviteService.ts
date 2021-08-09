import { toast } from 'react-toastify';
import {
  ERROR_FETCH_INVITE,
  Invite,
  REQ_FETCH_INVITE,
  RES_FETCH_INVITE,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setInviteToSign } from 'reducers/gameDux';

export const fetchInvite = (socket: Socket, inviteCode: string): void => {
  socket.emit(REQ_FETCH_INVITE, inviteCode);
};

const receivedInvite = (socket: Socket): void => {
  socket.on(RES_FETCH_INVITE, (payload: Invite) => {
    store.dispatch(setInviteToSign(payload));
  });
};

const errorFetchInvite = (socket: Socket): void => {
  socket.on(ERROR_FETCH_INVITE, (payload: string) => {
    toast(payload, { type: 'error' });
  });
};

export const initializeSocketForInvite = (socket: Socket): void => {
  receivedInvite(socket);
  errorFetchInvite(socket);
};
