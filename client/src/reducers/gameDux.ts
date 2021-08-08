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
  leaderboard: { [heroId: number]: number };
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
  leaderboard: {},
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
    removeSuperhero: (state, action: PayloadAction<number>): void => {
      const superheroes = state.game.heroes
        .slice()
        .filter((s) => s.id !== action.payload);
      state.game.heroes = superheroes;
      const leaderboard = { ...state.leaderboard };
      delete leaderboard[action.payload];
      state.leaderboard = leaderboard;
    },
    updateSuperheroScore: (
      state,
      action: PayloadAction<{ superheroId: number; score: number }>
    ): void => {
      state.leaderboard[action.payload.superheroId] = action.payload.score;
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
    clearLeaderboard: (state): void => {
      state.leaderboard = {};
    },
  },
});

export const {
  setGame,
  addSuperhero,
  removeSuperhero,
  updateSuperheroScore,
  setSelf,
  setIsOwner,
  clearGame,
  clearSelf,
  clearLeaderboard,
} = game.actions;

export default game.reducer;
