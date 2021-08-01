import {
  IO_CONNECT,
  REQ_CREATE_BINGO,
  REQ_FETCH_BINGO,
  REQ_UPDATE_BINGO,
  SOCKET_DISCONNECT,
} from 'shared';
import { Server } from 'socket.io';

import * as BingoHandler from './bingo';

const setUpIo = (io: Server): void => {
  io.on(IO_CONNECT, (socket) => {
    console.log('IO connected');
    // Bingo handlers
    socket.on(REQ_CREATE_BINGO, BingoHandler.socketCreateBingo(io, socket));
    socket.on(REQ_UPDATE_BINGO, BingoHandler.socketUpdateBingo(io, socket));
    socket.on(REQ_FETCH_BINGO, BingoHandler.socketFetchBingo(io, socket));

    socket.on(SOCKET_DISCONNECT, () => {
      // TODO: Clean up
      console.log('Disconnected');
    });
  });
  console.log('IO has been set up.');
};

export default setUpIo;
