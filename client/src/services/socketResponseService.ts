import {
  CreatedBingo,
  ERROR_FETCH_BINGO,
  RES_CREATE_BINGO,
  RES_FETCH_BINGO,
  RES_UPDATE_BINGO,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setBingo } from 'reducers/bingoDux';
import { updateErrorMessages, updateLoadingState } from 'reducers/miscDux';

const receivedBingo = (socket: Socket): void => {
  socket.on(RES_FETCH_BINGO, (payload: CreatedBingo) => {
    store.dispatch(updateLoadingState({ isFetching: false }));
    store.dispatch(setBingo(payload));
  });
};

const errorFetchBingo = (socket: Socket): void => {
  socket.on(ERROR_FETCH_BINGO, (payload: string) => {
    store.dispatch(updateLoadingState({ isFetching: false }));
    store.dispatch(updateErrorMessages({ fetchBingoError: payload }));
  });
};

const createdBingo = (socket: Socket): void => {
  socket.on(RES_CREATE_BINGO, (payload: CreatedBingo) => {
    store.dispatch(setBingo(payload));
  });
};

const updatedBingo = (socket: Socket): void => {
  socket.on(RES_UPDATE_BINGO, (payload: CreatedBingo) => {
    store.dispatch(setBingo(payload));
  });
};

export const initalizeSocket = (socket: Socket): void => {
  receivedBingo(socket);
  errorFetchBingo(socket);
  createdBingo(socket);
  updatedBingo(socket);
};
