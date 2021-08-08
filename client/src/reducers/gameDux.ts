/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Superhero } from 'shared';

export type DuxSuperhero = Superhero & {
  token: string;
};

export interface GameDux {
  game: Game;
  self: DuxSuperhero;
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
  self: {
    id: -1,
    name: '',
    gameId: -1,
    token: '',
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
    addSuperhero: (state, action: PayloadAction<Superhero>): void => {
      const superheroes = state.game.heroes.slice();
      superheroes.push(action.payload);
      state.game.heroes = superheroes;
    },
    setIsOwner: (state, action: PayloadAction<boolean>): void => {
      state.isOwner = action.payload;
    },
    setSelf: (state, action: PayloadAction<DuxSuperhero>): void => {
      state.self = action.payload;
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
    clearSelf: (state): void => {
      state.self = {
        id: -1,
        name: '',
        gameId: -1,
        token: '',
      };
    },
  },
});

export const {
  setGame,
  addSuperhero,
  setSelf,
  setIsOwner,
  clearGame,
  clearSelf,
} = game.actions;

export default game.reducer;
