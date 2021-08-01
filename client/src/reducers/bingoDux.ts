/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Bingo,
  CreatedBingo,
  Superpower,
  UpdatedBingo,
  UpdatedSuperpower,
} from 'shared';

export interface BingoDux {
  bingoInCreation: Bingo;
  bingoInUpdate: UpdatedBingo;
}

const initialState: BingoDux = {
  bingoInCreation: {
    name: '',
    superpowers: [],
  },
  bingoInUpdate: {
    id: -1,
    name: '',
    ownerCode: '',
    superpowers: [],
  },
};

// Contains user information, theme, view selected and fun fact of the day
const bingo = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    updateBingoInCreationName: (state, action: PayloadAction<string>): void => {
      state.bingoInCreation.name = action.payload;
    },
    updateBingoInCreationSuperpowers: (
      state,
      action: PayloadAction<Superpower[]>
    ): void => {
      state.bingoInCreation.superpowers = action.payload;
    },
    updateBingoInUpdateName: (state, action: PayloadAction<string>): void => {
      state.bingoInUpdate.name = action.payload;
    },
    updateBingoInUpdateSuperpowers: (
      state,
      action: PayloadAction<UpdatedSuperpower[]>
    ): void => {
      state.bingoInUpdate.superpowers = action.payload;
    },
    // Used after fetching the bingo from the server
    setBingoInUpdate: (state, action: PayloadAction<CreatedBingo>): void => {
      state.bingoInUpdate = action.payload;
    },
    clearBingoInCreation: (state): void => {
      state.bingoInCreation = {
        name: '',
        superpowers: [],
      };
    },
    clearBingoInUpdate: (state): void => {
      state.bingoInUpdate = {
        id: -1,
        name: '',
        ownerCode: '',
        superpowers: [],
      };
    },
  },
});

export const {
  updateBingoInCreationName,
  updateBingoInCreationSuperpowers,
  updateBingoInUpdateName,
  updateBingoInUpdateSuperpowers,
  setBingoInUpdate,
  clearBingoInCreation,
  clearBingoInUpdate,
} = bingo.actions;

export default bingo.reducer;
