/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ErrorMessages = {
  fetchBingoError: string;
};

export interface MiscDux {
  errors: ErrorMessages;
}

const initialState: MiscDux = {
  errors: {
    fetchBingoError: '',
  },
};

// Contains user information, theme, view selected and fun fact of the day
const misc = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    updateErrorMessages: (
      state,
      action: PayloadAction<Partial<ErrorMessages>>
    ): void => {
      state.errors = { ...state.errors, ...action.payload };
    },
  },
});

export const { updateErrorMessages } = misc.actions;

export default misc.reducer;
