import { toast } from 'react-toastify';
import {
  CreatedBingo,
  ERROR_CREATE_GAME,
  ERROR_FETCH_GAME,
  ERROR_JOIN_GAME,
  ERROR_LEAVE_GAME,
  ERROR_START_GAME,
  Game,
  Invite,
  NOTIF_JOIN_GAME,
  NOTIF_LEAVE_GAME,
  NOTIF_START_GAME,
  REQ_CREATE_GAME,
  REQ_FETCH_GAME,
  REQ_JOIN_GAME,
  REQ_LEAVE_GAME,
  REQ_START_GAME,
  RES_CREATE_GAME,
  RES_FETCH_GAME,
  RES_JOIN_GAME,
  RES_LEAVE_GAME,
  RES_START_GAME,
  Superhero,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { clearBingo, setBingo } from 'reducers/bingoDux';
import {
  addSuperhero,
  clearGame,
  clearLeaderboard,
  clearSelf,
  removeSuperhero,
  setGame,
  setInvitations,
  setIsOwner,
  setSelf,
} from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';

export const createGame = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_CREATE_GAME, ownerCode);
};

const createdGame = (socket: Socket): void => {
  socket.on(RES_CREATE_GAME, (payload: Game) => {
    store.dispatch(updateLoadingState({ isCreatingRoom: false }));
    store.dispatch(setGame(payload));
    store.dispatch(setIsOwner(true));
  });
};

const errorCreateGame = (socket: Socket): void => {
  socket.on(ERROR_CREATE_GAME, (payload: string) => {
    store.dispatch(updateLoadingState({ isCreatingRoom: false }));
    toast(payload, { type: 'error' });
  });
};

export const joinGame = (
  socket: Socket,
  joinCode: string,
  name: string
): void => {
  socket.emit(REQ_JOIN_GAME, { joinCode, name });
};

const joinedGame = (socket: Socket): void => {
  socket.on(
    RES_JOIN_GAME,
    (payload: {
      game: Game;
      bingo: CreatedBingo;
      user: Superhero;
      token: string;
      invites: Invite[];
    }) => {
      store.dispatch(updateLoadingState({ isJoining: false }));
      store.dispatch(setBingo(payload.bingo));
      store.dispatch(setGame(payload.game));
      store.dispatch(setInvitations(payload.invites));
      store.dispatch(setIsOwner(false));
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
  socket.on(NOTIF_JOIN_GAME, (payload: Superhero) => {
    store.dispatch(addSuperhero(payload));
  });
};

export const fetchGame = (socket: Socket, gameId: number): void => {
  socket.emit(REQ_FETCH_GAME, gameId);
};

const fetchedGame = (socket: Socket): void => {
  socket.on(RES_FETCH_GAME, (payload: Game) => {
    store.dispatch(setGame(payload));
  });
};

const onErrorFetchGame = (socket: Socket): void => {
  socket.on(ERROR_FETCH_GAME, (payload: string) => {
    toast(payload, { type: 'error' });
  });
};

export const leaveGame = (socket: Socket, token: string): void => {
  socket.emit(REQ_LEAVE_GAME, token);
};

const leftGame = (socket: Socket): void => {
  socket.on(RES_LEAVE_GAME, () => {
    store.dispatch(clearBingo());
    store.dispatch(clearGame());
    store.dispatch(clearSelf());
    store.dispatch(clearLeaderboard());
    toast('Left the game.', { type: 'success' });
  });
};

const onErrorLeaveGame = (socket: Socket): void => {
  socket.on(ERROR_LEAVE_GAME, (payload: string) => {
    toast(payload, { type: 'error' });
  });
};

const onNotifLeaveGame = (socket: Socket): void => {
  socket.on(NOTIF_LEAVE_GAME, (payload: number) => {
    store.dispatch(removeSuperhero(payload));
  });
};

export const startGame = (
  socket: Socket,
  gameId: number,
  ownerCode: string
): void => {
  socket.emit(REQ_START_GAME, { gameId, ownerCode });
};

const startedGame = (socket: Socket): void => {
  socket.on(RES_START_GAME, (payload: Game) => {
    store.dispatch(updateLoadingState({ isStartingGame: false }));
    store.dispatch(setGame(payload));
    store.dispatch(setIsOwner(true));
    store.dispatch(clearLeaderboard());
  });
};

const onErrorStartGame = (socket: Socket): void => {
  socket.on(ERROR_START_GAME, (payload: string) => {
    store.dispatch(updateLoadingState({ isStartingGame: false }));
    toast(payload, { type: 'error' });
  });
};

const onNotifStartGame = (socket: Socket): void => {
  socket.on(NOTIF_START_GAME, (payload: Game) => {
    store.dispatch(setIsOwner(false));
    store.dispatch(setGame(payload));
    store.dispatch(clearLeaderboard());
  });
};

export const initalizeSocketForGame = (socket: Socket): void => {
  createdGame(socket);
  errorCreateGame(socket);
  joinedGame(socket);
  onErrorJoined(socket);
  onNotifJoinedGame(socket);
  fetchedGame(socket);
  onErrorFetchGame(socket);
  leftGame(socket);
  onErrorLeaveGame(socket);
  onNotifLeaveGame(socket);
  startedGame(socket);
  onErrorStartGame(socket);
  onNotifStartGame(socket);
};
