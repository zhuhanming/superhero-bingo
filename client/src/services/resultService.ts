import { REQ_FETCH_RESULT, RES_FETCH_RESULT, SuperheroResult } from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setSuperheroResults } from 'reducers/gameDux';

export const fetchResult = (socket: Socket, gameId: number): void => {
  socket.emit(REQ_FETCH_RESULT, gameId);
};

const receivedInvite = (socket: Socket): void => {
  socket.on(RES_FETCH_RESULT, (payload: SuperheroResult[]) => {
    store.dispatch(setSuperheroResults(payload));
  });
};

export const initializeSocketForResult = (socket: Socket): void => {
  receivedInvite(socket);
};
