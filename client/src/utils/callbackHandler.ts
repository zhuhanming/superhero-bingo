/* eslint-disable @typescript-eslint/no-empty-function */
export const emptyFunction = (): void => {};

class CallbackHandler {
  fetchBingoCallback = emptyFunction;

  createGameCallback = emptyFunction;

  fetchGameOwnerCodeCallback = emptyFunction;

  fetchGameUserTokenCallback = emptyFunction;
}

export const callbackHandler = new CallbackHandler();
