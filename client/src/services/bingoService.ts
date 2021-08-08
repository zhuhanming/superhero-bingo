import { toast } from 'react-toastify';
import {
  Bingo,
  CreatedBingo,
  ERROR_CREATE_BINGO,
  ERROR_FETCH_BINGO,
  ERROR_UPDATE_BINGO,
  REQ_CREATE_BINGO,
  REQ_FETCH_BINGO,
  REQ_UPDATE_BINGO,
  RES_CREATE_BINGO,
  RES_FETCH_BINGO,
  RES_UPDATE_BINGO,
  UpdatedBingo,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import { setBingo } from 'reducers/bingoDux';
import { updateLoadingState } from 'reducers/miscDux';

export const fetchBingo = (socket: Socket, ownerCode: string): void => {
  socket.emit(REQ_FETCH_BINGO, ownerCode);
};

const receivedBingo = (socket: Socket): void => {
  socket.on(RES_FETCH_BINGO, (payload: CreatedBingo) => {
    store.dispatch(updateLoadingState({ isFetching: false }));
    store.dispatch(setBingo(payload));
  });
};

const errorFetchBingo = (socket: Socket): void => {
  socket.on(ERROR_FETCH_BINGO, (payload: string) => {
    store.dispatch(updateLoadingState({ isFetching: false }));
    toast(payload, { type: 'error' });
  });
};

export const createBingo = (socket: Socket, bingo: Bingo): void => {
  socket.emit(REQ_CREATE_BINGO, bingo);
};

const createdBingo = (socket: Socket): void => {
  socket.on(RES_CREATE_BINGO, (payload: CreatedBingo) => {
    store.dispatch(updateLoadingState({ isSaving: false }));
    store.dispatch(setBingo(payload));
    toast('Successfully saved bingo!', { type: 'success' });
  });
};

const errorCreateBingo = (socket: Socket): void => {
  socket.on(ERROR_CREATE_BINGO, (payload: string) => {
    store.dispatch(updateLoadingState({ isFetching: false }));
    toast(payload, { type: 'error' });
  });
};

export const updateBingo = (socket: Socket, bingo: UpdatedBingo): void => {
  socket.emit(REQ_UPDATE_BINGO, bingo);
};

const updatedBingo = (socket: Socket): void => {
  socket.on(RES_UPDATE_BINGO, (payload: CreatedBingo) => {
    store.dispatch(updateLoadingState({ isSaving: false }));
    store.dispatch(setBingo(payload));
    toast('Successfully updated bingo!', { type: 'success' });
  });
};

const errorUpdateBingo = (socket: Socket): void => {
  socket.on(ERROR_UPDATE_BINGO, (payload: string) => {
    store.dispatch(updateLoadingState({ isSaving: false }));
    toast(payload, { type: 'error' });
  });
};

export const initalizeSocketForBingo = (socket: Socket): void => {
  receivedBingo(socket);
  errorFetchBingo(socket);
  createdBingo(socket);
  errorCreateBingo(socket);
  updatedBingo(socket);
  errorUpdateBingo(socket);
};
