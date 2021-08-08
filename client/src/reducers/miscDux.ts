/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MiscDux {
  hasError: boolean;
}

const initialState: MiscDux = {
  hasError: false,
};

// Contains user information, theme, view selected and fun fact of the day
const misc = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setHasError: (state, action: PayloadAction<boolean>): void => {
      state.hasError = action.payload;
    },
  },
});

export const { setHasError } = misc.actions;

export default misc.reducer;
