/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ErrorMessages = {
  fetchBingoError: string;
};

type LoadingState = {
  isFetching: boolean;
  isSaving: boolean;
};

export interface MiscDux {
  errors: ErrorMessages;
  loading: LoadingState;
}

const initialState: MiscDux = {
  errors: {
    fetchBingoError: '',
  },
  loading: {
    isFetching: false,
    isSaving: false,
  },
};

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
    updateLoadingState: (
      state,
      action: PayloadAction<Partial<LoadingState>>
    ): void => {
      state.loading = { ...state.loading, ...action.payload };
    },
  },
});

export const { updateErrorMessages, updateLoadingState } = misc.actions;

export default misc.reducer;
