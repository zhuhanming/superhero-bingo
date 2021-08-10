import { Socket } from 'socket.io-client';

import { initalizeSocketForBingo } from './bingoService';
import { initalizeSocketForGame } from './gameService';
import { initializeSocketForInvite } from './inviteService';
import { initializeSocketForOwner } from './ownerService';
import { initializeSocketForResult } from './resultService';

export const initializeSocket = (socket: Socket): void => {
  initalizeSocketForBingo(socket);
  initalizeSocketForGame(socket);
  initializeSocketForInvite(socket);
  initializeSocketForResult(socket);
  initializeSocketForOwner(socket);
};
