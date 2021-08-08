import { toast } from 'react-toastify';
import {
  ERROR_CREATE_GAME,
  Game,
  REQ_CREATE_GAME,
  RES_CREATE_GAME,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setGame, setIsOwner } from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';

export const createGame = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_CREATE_GAME, ownerCode);
};

const createdGame = (socket: Socket): void => {
  socket.on(RES_CREATE_GAME, (payload: Game) => {
    store.dispatch(setGame(payload));
    store.dispatch(setIsOwner(true));
  });
};

const errorCreateGame = (socket: Socket): void => {
  socket.on(ERROR_CREATE_GAME, (payload: string) => {
    store.dispatch(updateLoadingState({ isStartingGame: false }));
    toast(payload, { type: 'error' });
  });
};

export const initalizeSocketForGame = (socket: Socket): void => {
  createdGame(socket);
  errorCreateGame(socket);
};
