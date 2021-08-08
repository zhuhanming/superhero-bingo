import {
  ERROR_CREATE_GAME,
  ERROR_FETCH_GAME,
  ERROR_JOIN_GAME,
  ERROR_LEAVE_GAME,
  ERROR_START_GAME,
  NOTIF_JOIN_GAME,
  NOTIF_LEAVE_GAME,
  NOTIF_START_GAME,
  RES_CREATE_GAME,
  RES_FETCH_GAME,
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
type FetchGameFunction = (gameId: number) => Promise<void>;
type LeaveGameFunction = (token: string) => Promise<void>;
type StartGameFunction = (data: {
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
      const { game, bingo, user, token } = await GameController.joinGame(
        data.joinCode,
        data.name
      );
      socket.join(`room-${game.id}`);
      socket.emit(RES_JOIN_GAME, { game, bingo, user, token });
      // Notify all current users that someone joined
      socket.to(`room-${game.id}`).emit(NOTIF_JOIN_GAME, user);
    } catch (error) {
      socket.emit(ERROR_JOIN_GAME, error.message);
    }
  };
};

export const socketFetchGame = (
  _io: Server,
  socket: Socket
): FetchGameFunction => {
  return async (gameId: number): Promise<void> => {
    console.log('REQ_FETCH_GAME');
    console.log('Game ID received: ', gameId);

    try {
      const game = await GameController.fetchGame(gameId);
      socket.join(`room-${game.id}`);
      socket.emit(RES_FETCH_GAME, game);
    } catch (error) {
      socket.emit(ERROR_FETCH_GAME, error.message);
    }
  };
};

export const socketLeaveGame = (
  _io: Server,
  socket: Socket
): LeaveGameFunction => {
  return async (token: string): Promise<void> => {
    console.log('REQ_LEAVE_GAME');
    console.log('Token received: ', token);

    try {
      const { gameId, superheroId } = await GameController.leaveGame(token);
      socket.to(`room-${gameId}`).emit(NOTIF_LEAVE_GAME, superheroId);
      socket.leave(`room-${gameId}`);
      socket.emit(RES_LEAVE_GAME);
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
      const updatedGame = await GameController.startGame(
        data.gameId,
        data.ownerCode
      );
      socket.emit(RES_START_GAME, updatedGame);
      socket.to(`room-${updatedGame.id}`).emit(NOTIF_START_GAME, updatedGame);
    } catch (error) {
      socket.emit(ERROR_START_GAME, error.message);
    }
  };
};
