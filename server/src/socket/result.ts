import { ERROR_FETCH_RESULT, RES_FETCH_RESULT } from 'shared';
import { Server, Socket } from 'socket.io';

import { fetchResults } from 'controllers/gameController';

type FetchResultsFunction = (gameId: number) => Promise<void>;

export const socketFetchResults = (
  _io: Server,
  socket: Socket
): FetchResultsFunction => {
  return async (gameId: number): Promise<void> => {
    console.log('REQ_FETCH_RESULT');
    console.log('Game ID received: ', gameId);

    try {
      const result = await fetchResults(gameId);
      socket.emit(RES_FETCH_RESULT, result);
    } catch (error) {
      socket.emit(ERROR_FETCH_RESULT, error.message);
    }
  };
};
