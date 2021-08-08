import {
  Bingo,
  REQ_CREATE_BINGO,
  REQ_FETCH_BINGO,
  REQ_UPDATE_BINGO,
  UpdatedBingo,
} from 'shared';
import { Socket } from 'socket.io-client';

export const fetchBingo = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_FETCH_BINGO, ownerCode);
};

export const createBingo = (socket: Socket, bingo: Bingo): void => {
  socket.emit(REQ_CREATE_BINGO, bingo);
};

export const updateBingo = (socket: Socket, bingo: UpdatedBingo): void => {
  socket.emit(REQ_UPDATE_BINGO, bingo);
};
