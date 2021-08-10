/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invite, Superhero } from 'shared';

export interface OwnerDux {
  superheroIdToInvites: { [id: number]: Invite[] };
}

const initialState: OwnerDux = {
  superheroIdToInvites: {},
};

// Contains user information, theme, view selected and fun fact of the day
const owner = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setSuperheroIdToInvite: (
      state,
      action: PayloadAction<{ [id: number]: Invite[] }>
    ): void => {
      state.superheroIdToInvites = action.payload;
    },
    addSuperheroIdAndInvites: (
      state,
      action: PayloadAction<{ superheroId: number; invites: Invite[] }>
    ): void => {
      state.superheroIdToInvites[action.payload.superheroId] =
        action.payload.invites;
    },
    removeSuperheroId: (state, action: PayloadAction<number>): void => {
      delete state.superheroIdToInvites[action.payload];
    },
    signInvitation: (
      state,
      action: PayloadAction<{
        ownerId: number;
        inviteId: number;
        signee: Superhero;
      }>
    ): void => {
      const userInvites = state.superheroIdToInvites[action.payload.ownerId];
      if (userInvites == null) {
        return;
      }
      const invitation = userInvites.find(
        (i) => i.id === action.payload.inviteId
      );
      if (invitation == null) {
        return;
      }
      const restOfInvitations = userInvites.filter(
        (i) => i.id !== action.payload.inviteId
      );
      const newInvites = [
        ...restOfInvitations,
        {
          ...invitation,
          signeeId: action.payload.signee.id,
          signeeName: action.payload.signee.name,
        },
      ];
      state.superheroIdToInvites[action.payload.ownerId] = newInvites;
    },
  },
});

export const {
  setSuperheroIdToInvite,
  addSuperheroIdAndInvites,
  removeSuperheroId,
  signInvitation,
} = owner.actions;

export default owner.reducer;
