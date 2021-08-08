import {
  ERROR_CREATE_GAME,
  ERROR_JOIN_GAME,
  NOTIF_JOINED_GAME,
  RES_CREATE_GAME,
  RES_JOIN_GAME,
} from 'shared';
import { Server, Socket } from 'socket.io';

import * as GameController from 'controllers/gameController';

type CreateGameFunction = (ownerCode: string) => Promise<void>;
type JoinGameFunction = (data: {
  joinCode: string;
  name: string;
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
      socket.to(`room-${game.id}`).emit(NOTIF_JOINED_GAME, user);
    } catch (error) {
      socket.emit(ERROR_JOIN_GAME, error.message);
    }
  };
};
