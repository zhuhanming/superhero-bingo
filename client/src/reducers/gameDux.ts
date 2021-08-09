/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Invite, Superhero } from 'shared';

export type DuxSuperhero = Superhero & {
  token: string;
};

export interface GameDux {
  game: Game;
  self: DuxSuperhero;
  leaderboard: { [heroId: number]: number };
  invitations: Invite[];
  inviteToSign?: Invite;
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
  leaderboard: {},
  invitations: [],
  inviteToSign: undefined,
};

// Contains user information, theme, view selected and fun fact of the day
const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>): void => {
      state.game = action.payload;
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
    setLeaderboard: (
      state,
      action: PayloadAction<{ [id: number]: number }>
    ): void => {
      state.leaderboard = action.payload;
    },
    updateSuperheroScore: (
      state,
      action: PayloadAction<{ superheroId: number; score: number }>
    ): void => {
      state.leaderboard[action.payload.superheroId] = action.payload.score;
    },
    setSelf: (state, action: PayloadAction<DuxSuperhero>): void => {
      state.self = action.payload;
    },
    setInvitations: (state, action: PayloadAction<Invite[]>): void => {
      state.invitations = action.payload;
    },
    trySignInvitation: (
      state,
      action: PayloadAction<{
        ownerId: number;
        inviteId: number;
        signee: Superhero;
      }>
    ): void => {
      const { ownerId, inviteId, signee } = action.payload;
      if (ownerId !== state.self.id) {
        return;
      }
      const invitation = state.invitations.find((i) => i.id === inviteId);
      if (invitation == null) {
        return;
      }
      const restOfInvitations = state.invitations.filter(
        (i) => i.id !== inviteId
      );
      state.invitations = [
        ...restOfInvitations,
        { ...invitation, signeeId: signee.id, signeeName: signee.name },
      ];
    },
    setInviteToSign: (state, action: PayloadAction<Invite>): void => {
      state.inviteToSign = action.payload;
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
    clearInvitations: (state): void => {
      state.invitations = [];
    },
    clearInviteToSign: (state): void => {
      state.inviteToSign = undefined;
    },
  },
});

export const {
  setGame,
  addSuperhero,
  removeSuperhero,
  setLeaderboard,
  updateSuperheroScore,
  setSelf,
  setInvitations,
  trySignInvitation,
  setInviteToSign,
  clearGame,
  clearSelf,
  clearLeaderboard,
  clearInvitations,
  clearInviteToSign,
} = game.actions;

export default game.reducer;
