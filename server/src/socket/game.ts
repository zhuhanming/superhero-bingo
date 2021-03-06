import {
  ERROR_CREATE_GAME,
  ERROR_END_GAME,
  ERROR_FETCH_GAME_OWNER_CODE,
  ERROR_FETCH_GAME_USER_TOKEN,
  ERROR_JOIN_GAME,
  ERROR_LEAVE_GAME,
  ERROR_START_GAME,
  NOTIF_END_GAME,
  NOTIF_JOIN_GAME,
  NOTIF_LEAVE_GAME,
  NOTIF_OWNER_JOIN_GAME,
  NOTIF_OWNER_LEAVE_GAME,
  NOTIF_START_GAME,
  RES_CREATE_GAME,
  RES_END_GAME,
  RES_FETCH_GAME_OWNER_CODE,
  RES_FETCH_GAME_USER_TOKEN,
  RES_JOIN_GAME,
  RES_LEAVE_GAME,
  RES_START_GAME,
} from 'shared';
import { Server, Socket } from 'socket.io';

import * as GameController from 'controllers/gameController';

type CreateGameFunction = (ownerCode: string) => Promise<void>;
type JoinGameFunction = (data: {
  joinCode: string;
  name: string;
}) => Promise<void>;
type FetchGameOwnerCodeFunction = (ownerCode: string) => Promise<void>;
type FetchGameUserTokenFunction = (token: string) => Promise<void>;
type LeaveGameFunction = (token: string) => Promise<void>;
type StartGameFunction = (data: {
  gameId: number;
  ownerCode: string;
}) => Promise<void>;
type EndGameFunction = (data: {
  gameId: number;
  ownerCode: string;
}) => Promise<void>;

export const socketCreateGame = (
  _io: Server,
  socket: Socket
): CreateGameFunction => {
  return async (ownerCode: string): Promise<void> => {
    console.log('REQ_CREATE_GAME');
    console.log('Owner code received: ', ownerCode);

    try {
      const game = await GameController.createGame(ownerCode);
      socket.join(`room-${game.id}`);
      socket.join(`room-${game.id}-owner`);
      socket.emit(RES_CREATE_GAME, game);
    } catch (error) {
      socket.emit(ERROR_CREATE_GAME, error.message);
    }
  };
};

export const socketJoinGame = (
  io: Server,
  socket: Socket
): JoinGameFunction => {
  return async (data: { joinCode: string; name: string }): Promise<void> => {
    console.log('REQ_JOIN_GAME');
    console.log('Join code received: ', data.joinCode);
    console.log('Name received: ', data.name);

    try {
      const { game, bingo, user, token, invites } =
        await GameController.joinGame(data.joinCode, data.name);
      socket.join(`room-${game.id}`);
      socket.emit(RES_JOIN_GAME, { game, bingo, user, token, invites });
      // Notify all current users that someone joined
      socket.to(`room-${game.id}`).emit(NOTIF_JOIN_GAME, user);
      // Notify owner with a copy of the invites
      io.in(`room-${game.id}-owner`).emit(NOTIF_OWNER_JOIN_GAME, {
        user,
        invites,
      });
    } catch (error) {
      socket.emit(ERROR_JOIN_GAME, error.message);
    }
  };
};

export const socketFetchGameOwnerCode = (
  _io: Server,
  socket: Socket
): FetchGameOwnerCodeFunction => {
  return async (ownerString: string): Promise<void> => {
    console.log('REQ_FETCH_GAME_OWNER_TOKEN');
    console.log('Owner token received: ', ownerString);

    try {
      const { game, bingo, leaderboard } =
        await GameController.fetchGameOwnerCode(ownerString);
      socket.join(`room-${game.id}`);
      socket.join(`room-${game.id}-owner`);
      socket.emit(RES_FETCH_GAME_OWNER_CODE, { game, bingo, leaderboard });
    } catch (error) {
      socket.emit(ERROR_FETCH_GAME_OWNER_CODE, error.message);
    }
  };
};

export const socketFetchGameUserToken = (
  _io: Server,
  socket: Socket
): FetchGameUserTokenFunction => {
  return async (token: string): Promise<void> => {
    console.log('REQ_FETCH_GAME_OWNER_TOKEN');
    console.log('Owner token received: ', token);

    try {
      const { game, bingo, leaderboard, user, invites } =
        await GameController.fetchGameUserToken(token);
      socket.join(`room-${game.id}`);
      socket.emit(RES_FETCH_GAME_USER_TOKEN, {
        game,
        bingo,
        leaderboard,
        user,
        invites,
        token,
      });
    } catch (error) {
      socket.emit(ERROR_FETCH_GAME_USER_TOKEN, error.message);
    }
  };
};

export const socketLeaveGame = (
  io: Server,
  socket: Socket
): LeaveGameFunction => {
  return async (token: string): Promise<void> => {
    console.log('REQ_LEAVE_GAME');
    console.log('Token received: ', token);

    try {
      const { gameId, superheroId, leaderboard } =
        await GameController.leaveGame(token);
      socket
        .to(`room-${gameId}`)
        .emit(NOTIF_LEAVE_GAME, { superheroId, leaderboard });
      socket.leave(`room-${gameId}`);
      socket.emit(RES_LEAVE_GAME);
      io.in(`room-${gameId}-owner`).emit(NOTIF_OWNER_LEAVE_GAME, superheroId);
    } catch (error) {
      socket.emit(ERROR_LEAVE_GAME, error.message);
    }
  };
};

export const socketStartGame = (
  _io: Server,
  socket: Socket
): StartGameFunction => {
  return async (data: { gameId: number; ownerCode: string }): Promise<void> => {
    console.log('REQ_START_GAME');
    console.log('Game ID received: ', data.gameId);
    console.log('Owner code received: ', data.ownerCode);

    try {
      const { game, bingo } = await GameController.startGame(
        data.gameId,
        data.ownerCode
      );
      socket.emit(RES_START_GAME, { game, bingo });
      socket.to(`room-${game.id}`).emit(NOTIF_START_GAME, { game, bingo });
    } catch (error) {
      socket.emit(ERROR_START_GAME, error.message);
    }
  };
};

export const socketEndGame = (_io: Server, socket: Socket): EndGameFunction => {
  return async (data: { gameId: number; ownerCode: string }): Promise<void> => {
    console.log('REQ_END_GAME');
    console.log('Game ID received: ', data.gameId);
    console.log('Owner code received: ', data.ownerCode);

    try {
      const results = await GameController.endGame(data.gameId, data.ownerCode);
      socket.emit(RES_END_GAME, results);
      socket.to(`room-${data.gameId}`).emit(NOTIF_END_GAME);
    } catch (error) {
      socket.emit(ERROR_END_GAME, error.message);
    }
  };
};
