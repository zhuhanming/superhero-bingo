/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoadingState = {
  isFetching: boolean;
  isSaving: boolean;
  isCreatingRoom: boolean;
  isJoining: boolean;
  isStartingGame: boolean;
  isEndingGame: boolean;
};

export interface MiscDux {
  loading: LoadingState;
}

const initialState: MiscDux = {
  loading: {
    isFetching: false,
    isSaving: false,
    isCreatingRoom: false,
    isJoining: false,
    isStartingGame: false,
    isEndingGame: false,
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
