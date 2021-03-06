import {
  Bingo,
  CreatedBingo,
  ERROR_CREATE_BINGO,
  ERROR_FETCH_BINGO,
  ERROR_UPDATE_BINGO,
  RES_CREATE_BINGO,
  RES_FETCH_BINGO,
  RES_UPDATE_BINGO,
} from 'shared';
import { Server, Socket } from 'socket.io';

import * as BingoController from 'controllers/bingoController';

type CreateBingoFunction = (bingoData: Bingo) => Promise<void>;
type UpdateBingoFunction = (bingoData: CreatedBingo) => Promise<void>;
type FetchBingoFunction = (ownerCode: string) => Promise<void>;

export const socketCreateBingo = (
  _io: Server,
  socket: Socket
): CreateBingoFunction => {
  return async (bingoData: Bingo): Promise<void> => {
    console.log('REQ_CREATE_BINGO');
    console.log('Bingo data received: ', bingoData);

    try {
      const bingo = await BingoController.createBingo(bingoData);
      socket.emit(RES_CREATE_BINGO, bingo);
    } catch (error: any) {
      console.error(error);
      socket.emit(ERROR_CREATE_BINGO, error.message);
    }
  };
};

export const socketUpdateBingo = (
  _io: Server,
  socket: Socket
): UpdateBingoFunction => {
  return async (bingoData: CreatedBingo): Promise<void> => {
    console.log('REQ_UPDATE_BINGO');
    console.log('Bingo data received: ', bingoData);

    try {
      const bingo = await BingoController.updateBingo(bingoData);
      socket.emit(RES_UPDATE_BINGO, bingo);
    } catch (error: any) {
      console.error(error);
      socket.emit(ERROR_UPDATE_BINGO, error.message);
    }
  };
};

export const socketFetchBingo = (
  _io: Server,
  socket: Socket
): FetchBingoFunction => {
  return async (ownerCode: string): Promise<void> => {
    console.log('REQ_FETCH_BINGO');
    console.log('Owner code received: ', ownerCode);

    try {
      const bingo = await BingoController.fetchBingo(ownerCode);
      socket.emit(RES_FETCH_BINGO, bingo);
    } catch (error: any) {
      console.error(error);
      socket.emit(ERROR_FETCH_BINGO, error.message);
    }
  };
};
