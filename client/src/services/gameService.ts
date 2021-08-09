import { toast } from 'react-toastify';
import {
  CreatedBingo,
  ERROR_CREATE_GAME,
  ERROR_FETCH_GAME_OWNER_CODE,
  ERROR_FETCH_GAME_USER_TOKEN,
  ERROR_JOIN_GAME,
  ERROR_LEAVE_GAME,
  ERROR_START_GAME,
  Game,
  Invite,
  NOTIF_JOIN_GAME,
  NOTIF_LEAVE_GAME,
  NOTIF_START_GAME,
  REQ_CREATE_GAME,
  REQ_FETCH_GAME_OWNER_CODE,
  REQ_FETCH_GAME_USER_TOKEN,
  REQ_JOIN_GAME,
  REQ_LEAVE_GAME,
  REQ_START_GAME,
  RES_CREATE_GAME,
  RES_FETCH_GAME_OWNER_CODE,
  RES_FETCH_GAME_USER_TOKEN,
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
  setLeaderboard,
  setSelf,
} from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';
import { callbackHandler, emptyFunction } from 'utils/callbackHandler';

export const createGame = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_CREATE_GAME, ownerCode);
};

const createdGame = (socket: Socket): void => {
  socket.on(RES_CREATE_GAME, (payload: Game) => {
    store.dispatch(updateLoadingState({ isCreatingRoom: false }));
    store.dispatch(setGame(payload));
    callbackHandler.createGameCallback();
    callbackHandler.createGameCallback = emptyFunction;
  });
};

const errorCreateGame = (socket: Socket): void => {
  socket.on(ERROR_CREATE_GAME, (payload: string) => {
    store.dispatch(updateLoadingState({ isCreatingRoom: false }));
    toast(payload, { type: 'error' });
    callbackHandler.createGameCallback = emptyFunction;
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
      store.dispatch(setBingo({ bingo: payload.bingo, isOwner: false }));
      store.dispatch(setGame(payload.game));
      store.dispatch(setInvitations(payload.invites));
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

export const fetchGameOwnerCode = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_FETCH_GAME_OWNER_CODE, ownerCode);
};

const fetchedGameOwnerCode = (socket: Socket): void => {
  socket.on(
    RES_FETCH_GAME_OWNER_CODE,
    (payload: {
      game: Game;
      bingo: CreatedBingo;
      leaderboard: { [id: number]: number };
    }) => {
      store.dispatch(setGame(payload.game));
      store.dispatch(setBingo({ bingo: payload.bingo, isOwner: true }));
      store.dispatch(setLeaderboard(payload.leaderboard));
      callbackHandler.fetchGameOwnerCodeCallback();
      callbackHandler.fetchGameOwnerCodeCallback = emptyFunction;
    }
  );
};

const onErrorFetchGameOwnerCode = (socket: Socket): void => {
  socket.on(ERROR_FETCH_GAME_OWNER_CODE, () => {
    store.dispatch(clearGame());
    store.dispatch(clearBingo());
    callbackHandler.fetchGameOwnerCodeCallback = emptyFunction;
  });
};

export const fetchGameUserToken = (socket: Socket, token: string): void => {
  socket.emit(REQ_FETCH_GAME_USER_TOKEN, token);
};

const fetchedGameUserToken = (socket: Socket): void => {
  socket.on(
    RES_FETCH_GAME_USER_TOKEN,
    (payload: {
      game: Game;
      bingo: CreatedBingo;
      leaderboard: { [id: number]: number };
      user: Superhero;
      invites: Invite[];
      token: string;
    }) => {
      store.dispatch(setGame(payload.game));
      store.dispatch(setBingo({ bingo: payload.bingo, isOwner: true }));
      store.dispatch(setLeaderboard(payload.leaderboard));
      store.dispatch(setSelf({ ...payload.user, token: payload.token }));
      store.dispatch(setInvitations(payload.invites));
      callbackHandler.fetchGameUserTokenCallback();
      callbackHandler.fetchGameUserTokenCallback = emptyFunction;
    }
  );
};

const onErrorFetchGameUserToken = (socket: Socket): void => {
  socket.on(ERROR_FETCH_GAME_USER_TOKEN, () => {
    store.dispatch(clearGame());
    store.dispatch(clearBingo());
    store.dispatch(clearSelf());
    callbackHandler.fetchGameUserTokenCallback = emptyFunction;
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
  socket.on(RES_START_GAME, (payload: { game: Game; bingo: CreatedBingo }) => {
    store.dispatch(updateLoadingState({ isStartingGame: false }));
    store.dispatch(setGame(payload.game));
    store.dispatch(setBingo({ bingo: payload.bingo, isOwner: true }));
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
  socket.on(
    NOTIF_START_GAME,
    (payload: { game: Game; bingo: CreatedBingo }) => {
      store.dispatch(setGame(payload.game));
      store.dispatch(setBingo({ bingo: payload.bingo, isOwner: false }));
      store.dispatch(clearLeaderboard());
    }
  );
};

export const initalizeSocketForGame = (socket: Socket): void => {
  createdGame(socket);
  errorCreateGame(socket);
  joinedGame(socket);
  onErrorJoined(socket);
  onNotifJoinedGame(socket);
  fetchedGameOwnerCode(socket);
  onErrorFetchGameOwnerCode(socket);
  fetchedGameUserToken(socket);
  onErrorFetchGameUserToken(socket);
  leftGame(socket);
  onErrorLeaveGame(socket);
  onNotifLeaveGame(socket);
  startedGame(socket);
  onErrorStartGame(socket);
  onNotifStartGame(socket);
};
