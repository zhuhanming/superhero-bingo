import { Socket } from 'socket.io-client';

import { initalizeSocketForBingo } from './bingoService';
import { initalizeSocketForGame } from './gameService';

export const initializeSocket = (socket: Socket): void => {
  initalizeSocketForBingo(socket);
  initalizeSocketForGame(socket);
};
