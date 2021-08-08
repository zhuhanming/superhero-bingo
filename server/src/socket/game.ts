import { ERROR_CREATE_GAME, RES_CREATE_GAME } from 'shared';
import { Server, Socket } from 'socket.io';

import * as GameController from 'controllers/gameController';

type CreateGameFunction = (ownerCode: string) => Promise<void>;

export const socketCreateGame = (
  _io: Server,
  socket: Socket
): CreateGameFunction => {
  return async (ownerCode: string): Promise<void> => {
    console.log('REQ_CREATE_GAME');
    console.log('Owner code received: ', ownerCode);

    try {
      const game = await GameController.createGame(ownerCode);
      socket.emit(RES_CREATE_GAME, game);
    } catch (error) {
      socket.emit(ERROR_CREATE_GAME, error.message);
    }
  };
};
