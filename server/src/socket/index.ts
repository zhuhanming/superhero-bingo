import {
  CONNECT,
  REQ_CREATE_BINGO,
  REQ_CREATE_GAME,
  REQ_FETCH_BINGO,
  REQ_FETCH_GAME,
  REQ_JOIN_GAME,
  REQ_LEAVE_GAME,
  REQ_START_GAME,
  REQ_UPDATE_BINGO,
  SOCKET_DISCONNECT,
} from 'shared';
import { Server } from 'socket.io';

import * as BingoHandler from './bingo';
import * as GameHandler from './game';

const setUpIo = (io: Server): void => {
  io.on(CONNECT, (socket) => {
    console.log('IO connected');
    socket.on(CONNECT, () => console.log('Socket connected'));
    // Bingo handlers
    socket.on(REQ_CREATE_BINGO, BingoHandler.socketCreateBingo(io, socket));
    socket.on(REQ_UPDATE_BINGO, BingoHandler.socketUpdateBingo(io, socket));
    socket.on(REQ_FETCH_BINGO, BingoHandler.socketFetchBingo(io, socket));

    // Game handlers
    socket.on(REQ_CREATE_GAME, GameHandler.socketCreateGame(io, socket));
    socket.on(REQ_JOIN_GAME, GameHandler.socketJoinGame(io, socket));
    socket.on(REQ_FETCH_GAME, GameHandler.socketFetchGame(io, socket));
    socket.on(REQ_LEAVE_GAME, GameHandler.socketLeaveGame(io, socket));
    socket.on(REQ_START_GAME, GameHandler.socketStartGame(io, socket));

    socket.on(SOCKET_DISCONNECT, () => {
      // TODO: Clean up
      console.log('Disconnected');
    });
  });
  console.log('IO has been set up.');
};

export default setUpIo;
