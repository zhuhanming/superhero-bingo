/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatedBingo, UpdatedBingo, UpdatedSuperpower } from 'shared';
import { v4 as uuidv4 } from 'uuid';

import { sortByOrder } from 'utils/sortUtils';

export type DuxSuperpower = UpdatedSuperpower & {
  uniqueId: string;
};

type DuxBingo = Omit<UpdatedBingo, 'superpowers'> & {
  superpowers: DuxSuperpower[];
};

export interface BingoDux {
  bingo: DuxBingo;
}

const initialState: BingoDux = {
  bingo: {
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
    updateBingoName: (state, action: PayloadAction<string>): void => {
      state.bingo.name = action.payload;
    },
    updateBingoSuperpowers: (
      state,
      action: PayloadAction<UpdatedSuperpower[]>
    ): void => {
      const superpowers = action.payload.map((s) => ({
        ...s,
        uniqueId: `superpower-${s.order}`,
      }));
      state.bingo.superpowers = superpowers;
    },
    addBingoSuperpower: (state): void => {
      let newOrder;
      if (state.bingo.superpowers.length === 0) {
        newOrder = 0;
      } else {
        newOrder = Math.max(...state.bingo.superpowers.map((s) => s.order)) + 1;
      }
      const superpowersCopy = state.bingo.superpowers.slice();
      superpowersCopy.push({
        uniqueId: uuidv4(),
        description: '',
        order: newOrder,
      });
      state.bingo.superpowers = superpowersCopy;
    },
    updateBingoSuperpower: (
      state,
      action: PayloadAction<{
        index: number;
        description: string;
        uniqueId?: string;
      }>
    ): void => {
      const { index, description, uniqueId } = action.payload;
      if (index < 0 || index >= state.bingo.superpowers.length) {
        return;
      }
      const superpowersCopy = state.bingo.superpowers.slice().sort(sortByOrder);
      superpowersCopy[index] = {
        ...superpowersCopy[index],
        description,
        uniqueId: uniqueId ?? superpowersCopy[index].uniqueId,
      };
      state.bingo.superpowers = superpowersCopy;
    },
    deleteBingoSuperpower: (state, action: PayloadAction<number>): void => {
      const index = action.payload;
      if (index < 0 || index >= state.bingo.superpowers.length) {
        return;
      }
      const superpowersCopy = state.bingo.superpowers.slice().sort(sortByOrder);
      superpowersCopy.splice(index, 1);
      for (let i = 0; i < superpowersCopy.length; i += 1) {
        superpowersCopy[i].order = i;
      }
      state.bingo.superpowers = superpowersCopy;
    },
    // Used after fetching the bingo from the server
    setBingo: (
      state,
      action: PayloadAction<{ bingo: CreatedBingo; isOwner: boolean }>
    ): void => {
      const superpowers = action.payload.bingo.superpowers.map((s) => ({
        ...s,
        uniqueId: `superpower-${s.order}`,
      }));
      const bingo = {
        ...action.payload.bingo,
        superpowers,
        ownerCode: action.payload.isOwner ? action.payload.bingo.ownerCode : '',
      };
      state.bingo = bingo;
    },
    clearBingo: (state): void => {
      state.bingo = {
        id: -1,
        name: '',
        ownerCode: '',
        superpowers: [],
      };
    },
  },
});

export const {
  updateBingoName,
  updateBingoSuperpowers,
  addBingoSuperpower,
  updateBingoSuperpower,
  deleteBingoSuperpower,
  setBingo,
  clearBingo,
} = bingo.actions;

export default bingo.reducer;
