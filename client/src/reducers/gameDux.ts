/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from 'shared';

export interface GameDux {
  game: Game;
  isOwner: boolean;
  lastFetched: number;
}

const initialState: GameDux = {
  game: {
    id: -1,
    joinCode: '',
    bingoId: -1,
    hasStarted: false,
    hasEnded: false,
    heroes: [],
  },
  isOwner: false,
  lastFetched: Date.now(),
};

// Contains user information, theme, view selected and fun fact of the day
const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>): void => {
      state.game = action.payload;
      state.lastFetched = Date.now();
    },
    setIsOwner: (state, action: PayloadAction<boolean>): void => {
      state.isOwner = action.payload;
    },
    clearGame: (state): void => {
      state.game = {
        id: -1,
        joinCode: '',
        bingoId: -1,
        hasStarted: false,
        hasEnded: false,
        heroes: [],
      };
    },
  },
});

export const { setGame, setIsOwner, clearGame } = game.actions;

export default game.reducer;
