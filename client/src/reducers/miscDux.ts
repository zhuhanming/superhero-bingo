/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoadingState = {
  isFetching: boolean;
  isSaving: boolean;
  isStartingGame: boolean;
};

export interface MiscDux {
  loading: LoadingState;
}

const initialState: MiscDux = {
  loading: {
    isFetching: false,
    isSaving: false,
    isStartingGame: false,
  },
};

const misc = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    updateLoadingState: (
      state,
      action: PayloadAction<Partial<LoadingState>>
    ): void => {
      state.loading = { ...state.loading, ...action.payload };
    },
  },
});

export const { updateLoadingState } = misc.actions;

export default misc.reducer;
