import { toast } from 'react-toastify';
import {
  CreatedBingo,
  ERROR_CREATE_GAME,
  ERROR_JOIN_GAME,
  Game,
  NOTIF_JOINED_GAME,
  REQ_CREATE_GAME,
  REQ_JOIN_GAME,
  RES_CREATE_GAME,
  RES_JOIN_GAME,
  Superhero,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setBingo } from 'reducers/bingoDux';
import { addSuperhero, setGame, setIsOwner, setSelf } from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';

export const createGame = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_CREATE_GAME, ownerCode);
};

export const joinGame = (
  socket: Socket,
  joinCode: string,
  name: string
): void => {
  socket.emit(REQ_JOIN_GAME, { joinCode, name });
};

const createdGame = (socket: Socket): void => {
  socket.on(RES_CREATE_GAME, (payload: Game) => {
    store.dispatch(updateLoadingState({ isStartingGame: false }));
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

const joinedGame = (socket: Socket): void => {
  socket.on(
    RES_JOIN_GAME,
    (payload: {
      game: Game;
      bingo: CreatedBingo;
      user: Superhero;
      token: string;
    }) => {
      store.dispatch(updateLoadingState({ isJoining: false }));
      store.dispatch(setBingo(payload.bingo));
      store.dispatch(setGame(payload.game));
      store.dispatch(setSelf({ ...payload.user, token: payload.token }));
    }
  );
};

const onErrorJoined = (socket: Socket): void => {
  socket.on(ERROR_JOIN_GAME, (payload: string) => {
    store.dispatch(updateLoadingState({ isJoining: false }));
    toast(payload, { type: 'error' });
  });
};

const onNotifJoinedGame = (socket: Socket): void => {
  socket.on(NOTIF_JOINED_GAME, (payload: Superhero) => {
    store.dispatch(addSuperhero(payload));
  });
};

export const initalizeSocketForGame = (socket: Socket): void => {
  createdGame(socket);
  errorCreateGame(socket);
  joinedGame(socket);
  onErrorJoined(socket);
  onNotifJoinedGame(socket);
};
